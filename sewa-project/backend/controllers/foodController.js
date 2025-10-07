import Food from "../models/Food.js";

// ---------------- MARK EXPIRED FOODS ----------------
const markExpiredFoods = async () => {
  try {
    await Food.updateMany(
      { status: "available", expiryAt: { $lte: new Date() } },
      { status: "expired" }
    );
  } catch (err) {
    console.error("Error marking expired foods:", err);
  }
};

// ---------------- ADD FOOD ----------------
export const addFood = async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const {
      hotelId,
      hotelName,
      foodType,
      quantity,
      servesPeople,
      description,
      preparedAt: preparedAtRaw,
      expiryAt: expiryAtRaw,
      pickupAddress,
      images
    } = req.body;

    // Required fields validation
    if (!hotelId || !hotelName || !foodType || !quantity || !servesPeople || !preparedAtRaw || !pickupAddress) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["hotelId","hotelName","foodType","quantity","servesPeople","preparedAt","pickupAddress"]
      });
    }

    // Default shelf-life (in hours) based on food type
    const shelfLifeMap = {
      vegan: 24,
      veg: 12,
      'non-veg': 6
    };
    const [year, month, day] = preparedAtRaw.split('-').map(Number);
    const [hours, minutes] = req.body.prepTime.split(':').map(Number);
    const preparedAt = new Date(year, month - 1, day, hours, minutes);
    // Compute expiryAt automatically if not provided
    const expiryAt = expiryAtRaw
      ? new Date(expiryAtRaw)
      : new Date(preparedAt.getTime() + (shelfLifeMap[foodType] || 6) * 60 * 60 * 1000);

    const now = new Date();

    if (expiryAt <= preparedAt) {
      return res.status(400).json({ message: "Best Before must be after Preparation time" });
    }
    if (expiryAt <= now) {
      return res.status(400).json({ message: "Food has already expired" });
    }

    if (images && images.length > 4) {
      return res.status(400).json({ message: "Maximum 4 images allowed" });
    }

    const newFood = new Food({
      hotelId,
      hotelName,
      foodType,
      quantity: Number(quantity),
      servesPeople: Number(servesPeople),
      description,
      preparedAt,
      expiryAt,
      pickupAddress,
      images: images || []
    });

    const savedFood = await newFood.save();
    console.log("Food saved successfully:", savedFood);

    res.status(201).json({
      message: "Food availability added successfully",
      food: savedFood
    });

  } catch (error) {
    console.error("Error in addFood controller:", error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation Error",
        errors: validationErrors
      });
    }

    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

// ---------------- DONATION HISTORY FOR HOTEL ----------------
export const getDonationHistory = async (req, res) => {
  try {
    const { hotelId } = req.params;

    if (!hotelId) {
      return res.status(400).json({ message: "Hotel ID is required" });
    }

   
    await markExpiredFoods();

    const donations = await Food.find({ hotelId })
      .sort({ createdAt: -1 })
      .populate("acceptedByNgoId", "organizationName email phone")
      .lean();

    res.json({
      message: "Donation history fetched successfully",
      donations
    });
  } catch (error) {
    console.error("Error fetching donation history:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

// ---------------- AVAILABLE DONATIONS ----------------
export const getAvailableDonations = async (req, res) => {
  try {
    const { ngoId } = req.query;

    await markExpiredFoods();

    let filter = { status: "available" };
    if (ngoId) filter.rejectedBy = { $ne: ngoId };

    const donations = await Food.find(filter)
      .sort({ createdAt: -1 })
      .populate("hotelId", " phone email  managerName"); 
    console.log(donations);
    res.json({
      message: "Available donations fetched successfully",
      donations
    });
  } catch (error) {
    console.error("Error fetching available donations:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


// ---------------- ACCEPT DONATION ----------------
export const acceptDonation = async (req, res) => {
  try {
    const { id } = req.params; 
    const { ngoId, ngoName } = req.body;

    if (!ngoId || !ngoName) {
      return res.status(400).json({ message: "NGO ID and name are required" });
    }

   
    await markExpiredFoods();

    const food = await Food.findOneAndUpdate(
      { _id: id, status: "available" },
      {
        status: "taken",
        acceptedByNgo: ngoName,
        acceptedByNgoId: ngoId,
        acceptedAt: new Date()
      },
      { new: true }
    );

    if (!food) {
      return res.status(404).json({ message: "Donation not found or already taken/expired" });
    }

    res.json({
      message: "Donation accepted successfully",
      food
    });
  } catch (error) {
    console.error("Error accepting donation:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

export const rejectDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { ngoId } = req.body;

    console.log("🟢 Rejecting donation:", id, "by NGO:", ngoId);

    const donation = await Food.findById(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Add NGO to rejectedBy list if not already added
    if (!donation.rejectedBy.includes(ngoId)) {
      donation.rejectedBy.push(ngoId);
      await donation.save();
    }

    res.status(200).json({ message: "Donation rejected successfully" });
  } catch (error) {
    console.error("❌ Error rejecting donation:", error);
    res.status(500).json({ message: "Server error while rejecting donation" });
  }
};


// ---------------- NGO HISTORY ----------------
export const getNgoHistory = async (req, res) => {
  try {
    const { ngoId } = req.params;

    if (!ngoId) {
      return res.status(400).json({ message: "NGO ID is required" });
    }
    await markExpiredFoods();

    const history = await Food.find({
      acceptedByNgoId: ngoId,
      status: "taken"
    })
      .sort({ acceptedAt: -1 });

    res.json(history);
  } catch (err) {
    console.error("Error fetching NGO history:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
