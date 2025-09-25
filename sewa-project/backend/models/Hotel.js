import mongoose from "mongoose";
const hotelSchema = new mongoose.Schema({
    hotelName: { type: String, required: true },
    managerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true }
}, { timestamps: true });
export default mongoose.model("Hotel", hotelSchema);