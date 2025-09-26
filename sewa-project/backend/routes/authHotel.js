import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// Hotel Signup
router.post("/signup", async (req, res) => {
  try {
    console.log('Hotel signup request received:', req.body);
    
    const { hotelName, managerName, address, licenseNumber, phone, email, password } = req.body;
    
    // Validation
    if (!hotelName || !managerName || !address || !licenseNumber || !phone || !email || !password) {
      return res.status(400).json({ 
        message: "All fields are required",
        missing: {
          hotelName: !hotelName,
          managerName: !managerName,
          address: !address,
          licenseNumber: !licenseNumber,
          phone: !phone,
          email: !email,
          password: !password
        }
      });
    }

    // Check if hotel already exists
    const existingHotel = await Hotel.findOne({ email });
    if (existingHotel) {
      return res.status(400).json({ message: "Hotel with this email already exists" });
    }

    // Check if license number already exists
    const existingLicense = await Hotel.findOne({ licenseNumber });
    if (existingLicense) {
      return res.status(400).json({ message: "Hotel with this license number already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new hotel
    const hotel = new Hotel({
      hotelName,
      managerName,
      address,
      licenseNumber,
      phone,
      email,
      password: hashedPassword
    });

    await hotel.save();
    console.log('Hotel created successfully:', hotel._id);

    res.status(201).json({ 
      message: "Hotel registration successful!",
      hotelId: hotel._id 
    });

  } catch (err) {
    console.error('Hotel signup error:', err);
    
    // Handle MongoDB validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: "Validation error", 
        errors: validationErrors 
      });
    }

    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field} already exists. Please use a different ${field}.`
      });
    }

    res.status(500).json({ 
      message: "Internal server error", 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hotel = await Hotel.findOne({ email });
    if (!hotel) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, hotel.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: hotel._id, role: "hotel" }, "jwt_secret", { expiresIn: "1h" });

    // Send hotel info along with token
    res.json({
      message: "Login successful",
      token,
      hotel: {
        hotelId: hotel._id,
        hotelName: hotel.hotelName,
        email: hotel.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;