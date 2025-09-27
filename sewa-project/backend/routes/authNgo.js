
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Ngo from "../models/Ngo.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { organizationName, contactPerson, address, licenseNumber, phone, email, password } = req.body;

    const existingNgo = await Ngo.findOne({ email });
    if (existingNgo) return res.status(400).json({ message: "NGO already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const ngo = new Ngo({ organizationName, contactPerson, address, licenseNumber, phone, email, password: hashedPassword });
    await ngo.save();

    res.status(201).json({ message: "NGO signup successful!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const ngo = await Ngo.findOne({ email });
    if (!ngo) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: ngo._id, role: "ngo" }, "jwt_secret", { expiresIn: "1h" });

    res.json({
       message: "Login successful", 
       token,
        ngo: { id: ngo._id, organizationName: ngo.organizationName, email: ngo.email
        }
       });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;