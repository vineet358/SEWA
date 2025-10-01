import Food from "../models/Food.js";

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
      preparedAt,
      expiryAt,
      pickupAddress,
      images
    } = req.body;


    if (!hotelId || !hotelName || !foodType || !quantity || !servesPeople || !preparedAt || !expiryAt || !pickupAddress) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["hotelId", "hotelName", "foodType", "quantity", "servesPeople", "preparedAt", "expiryAt", "pickupAddress"]
      });
    }
    const preparedDate = new Date(preparedAt);
    const expiryDate = new Date(expiryAt);
    const currentDate = new Date();

    if (isNaN(preparedDate.getTime()) || isNaN(expiryDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (expiryDate <= preparedDate) {
      return res.status(400).json({ message: "Best Before must be after Preparation time" });
    }
    if (expiryDate <= currentDate) {
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
      preparedAt: preparedDate,
      expiryAt: expiryDate,
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
}


export const getDonationHistory = async (req, res) => {
  try {
    const { hotelId } = req.params;

    if (!hotelId) {
      return res.status(400).json({ message: "Hotel ID is required" });
    }

    const donations = await Food.find({ hotelId }).sort({ createdAt: -1 }); 

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

export const getAvailableDonations=async(req,res)=>{
  try{
    const donations=await Food.find({status:"available"}).sort({createdAt:-1});
    res.json({
      message:"Available donations fetched successfully",
      donations
    });
  } catch(error){
    console.error("Error fetching available donations:", error);
    res.status(500).json({
      message:"Server Error",
      error:error.message
    });
  }
};

export const acceptDonation = async (req, res) => {
  try {
    const { id } = req.params;               // Food ID
    const { ngoId, ngoName } = req.body;     // Send both from frontend

    if (!ngoId || !ngoName) {
      return res.status(400).json({ message: "NGO ID and name are required" });
    }

    const food = await Food.findOneAndUpdate(
      { _id: id, status: "available" },      // Only available donations
      {
        status: "taken",
        acceptedByNgo: ngoName,              // Optional display field
        acceptedByNgoId: ngoId,              // NEW: unique ID
        acceptedAt: new Date(),
      },
      { new: true }
    );

    if (!food) {
      return res.status(404).json({ message: "Donation not found or already taken" });
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

    const food = await Food.findOneAndUpdate(
      { _id: id, status: "available" },
      { status: "expired" },         
      { new: true }
    );

    if (!food) {
      return res
        .status(400)
        .json({ msg: "Food not found or already processed" });
    }

    res.json({ msg: "Donation rejected", food });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export const getNgoHistory = async (req, res) => {
  try {
    const { ngoId } = req.params;  // Now we expect ID, not name

    if (!ngoId) {
      return res.status(400).json({ message: "NGO ID is required" });
    }

    const history = await Food.find({
      acceptedByNgoId: ngoId,       // Use unique ObjectId
      status: "taken",
    }).sort({ acceptedAt: -1 });

    res.json(history);  // returns all donations accepted by this NGO
  } catch (err) {
    console.error("Error fetching NGO history:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

