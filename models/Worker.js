import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: String,
  phoneNumber: String,
  status: String,
  passportNumber: String,
  permitVisaExpiry: Date,
  RMPaid: Number,
});

export default mongoose.model("Worker", workerSchema);
