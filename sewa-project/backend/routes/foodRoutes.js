import express from "express";
import { addFood ,getDonationHistory,getAvailableDonations} from "../controllers/foodController.js";

const router = express.Router();


router.post("/add", addFood);
router.get("/history/:hotelId", getDonationHistory);
router.get("/available",getAvailableDonations);
export default router;
