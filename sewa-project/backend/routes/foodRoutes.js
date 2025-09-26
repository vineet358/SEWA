import express from "express";
import { addFood ,getDonationHistory,getAvailableDonations,acceptDonation,rejectDonation,getNgoHistory} from "../controllers/foodController.js";

const router = express.Router();


router.post("/add", addFood);
router.get("/history/:hotelId", getDonationHistory);
router.get("/available",getAvailableDonations);
router.put("/:id/accept",acceptDonation);
router.put("/:id/reject",rejectDonation);
router.get("/ngo/history/:ngoName",getNgoHistory);
export default router;
