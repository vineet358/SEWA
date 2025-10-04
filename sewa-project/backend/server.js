import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import individualAuth from "./routes/AuthIndividual.js";
import ngoAuth from "./routes/authNgo.js";
import hotelAuth from "./routes/authHotel.js";
import foodRoutes from "./routes/foodRoutes.js";
import hotelDashboardRoutes from "./routes/hotelDashboard.js";
import reportRoutes from "./routes/reportRoutes.js";
import HotelReportRoutes from "./routes/HotelReportRoutes.js";



const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth/individual", individualAuth);
app.use("/api/auth/ngo", ngoAuth);
app.use("/api/auth/hotel", hotelAuth);
app.use("/api/food",foodRoutes);
app.use("/api/hotel", hotelDashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/hotelReports", HotelReportRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));
