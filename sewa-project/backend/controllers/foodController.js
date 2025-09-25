import Food from "../models/Food.js";

export const addFood = async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Add this for debugging

    const {
      licenseNo,
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

    // Validate required fields
    if (!licenseNo || !hotelName || !foodType || !quantity || !servesPeople || !preparedAt || !expiryAt || !pickupAddress) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["licenseNo", "hotelName", "foodType", "quantity", "servesPeople", "preparedAt", "expiryAt", "pickupAddress"]
      });
    }

    // Convert to Date objects properly
    const preparedDate = new Date(preparedAt);
    const expiryDate = new Date(expiryAt);
    const currentDate = new Date();

    console.log("Dates:", { preparedDate, expiryDate, currentDate }); // Add this for debugging

    // Validate dates
    if (isNaN(preparedDate.getTime()) || isNaN(expiryDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Check if expiry is after preparation
    if (expiryDate <= preparedDate) {
      return res.status(400).json({ message: "Best Before must be after Preparation time" });
    }

    // Check if food hasn't already expired
    if (expiryDate <= currentDate) {
      return res.status(400).json({ message: "Food has already expired" });
    }

    // Validate images
    if (images && images.length > 4) {
      return res.status(400).json({ message: "Maximum 4 images allowed" });
    }

    // Create new food document
    const newFood = new Food({
      licenseNo,
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
    console.log("Food saved successfully:", savedFood); // Add this for debugging

    res.status(201).json({ 
      message: "Food availability added successfully", 
      food: savedFood 
    });

  } catch (error) {
    console.error("Error in addFood controller:", error); // Add this for debugging
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation Error", 
        errors: validationErrors 
      });
    }

    // Handle other errors
    res.status(500).json({ 
      message: "Server Error", 
      error: error.message 
    });
  }
};