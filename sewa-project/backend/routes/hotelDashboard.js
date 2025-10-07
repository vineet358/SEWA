import express from "express";
import Food from "../models/Food.js";

const router = express.Router();


router.get("/:hotelName/dashboard", async (req, res) => {
  try {
    const { hotelName } = req.params;
    const foods = await Food.find({ hotelName });
    const acceptedFoods = foods.filter(f => f.status === "taken");

    const totalDonations = acceptedFoods.length; 
    const totalServings = acceptedFoods.reduce((sum, f) => sum + (f.servesPeople || 0), 0);
    const ngosServed = [...new Set(acceptedFoods.map(f => f.acceptedByNgo))].length;
    const peopleFed = totalServings;

    const monthlyDonations = Array(12).fill(0);
    acceptedFoods.forEach(f => {
      const month = new Date(f.createdAt).getMonth();
      monthlyDonations[month]++;
    });

    const recentDonations = acceptedFoods
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(f => ({
        id: f._id,
        ngo: f.acceptedByNgo || "N/A",
        quantity: f.servesPeople,
        status: f.status,
        date: f.createdAt
      }));

    res.json({
      totalDonations,
      totalServings,
      ngosServed,
      peopleFed,
      monthlyDonations,
      recentDonations
    });

  } catch (err) {
    console.error("Error fetching hotel dashboard:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

export default router;
