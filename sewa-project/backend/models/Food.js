import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  hotelName: {
    type: String,
    required: true,
  },
  foodType: {
    type: String,
    required: true, 
  },
  quantity: {
    type: Number,
    required: true,
  },
  servesPeople: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  preparedAt: {
    type: Date,
    required: true,
  },
  expectedShelfLife: {
    type: Number, // in hours
    default: 6,   // default shelf life (auto-chosen by backend)
  },
  expiryAt: {
    type: Date,   // auto-calculated from preparedAt + expectedShelfLife
  },
  pickupAddress: {
    type: String,
    required: true,
  },
  images: {
    type: [String], 
    validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
  },
  status: {
    type: String,
    enum: ["available", "taken", "expired"],
    default: "available",
  },
  acceptedAt: { 
    type: Date, 
    default: null 
  },
  acceptedByNgo: { 
    type: String, 
    default: null 
  },     
  acceptedByNgoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Ngo", 
    default: null 
  }, 
  rejectedBy: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Ngo" }
  ]
}, { timestamps: true });

function arrayLimit(val) {
  return val.length <= 4;
}

const Food = mongoose.model("Food", foodSchema);
export default Food;
