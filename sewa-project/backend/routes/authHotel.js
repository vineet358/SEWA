
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Hotel from "../models/Hotel.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { hotelName, contactPerson, address, licenseNumber, phone, email, password } = req.body;
    const existingHotel = await Hotel.findOne({ email });
    if (existingHotel) return res.status(400).json({ message: "Hotel already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
     const hotel = new Hotel({ hotelName, contactPerson, address, licenseNumber, phone, email, password: hashedPassword });
    await hotel.save();
    res.status(201).json({ message: "Hotel signup successful!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
