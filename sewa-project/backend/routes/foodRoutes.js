import express from "express";
import { addFood } from "../controllers/foodController.js";

const router = express.Router();


router.post("/add", addFood);

export default router;
