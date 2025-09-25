import mongoose from "mongoose";
const ngoSchema = new mongoose.Schema({
    organizationName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true }
}, { timestamps: true });
export default mongoose.model("Ngo", ngoSchema);