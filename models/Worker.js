import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    name: String,
    phoneNumber: String,
    status: String,
    passportNumber: String,
    permitVisaExpiry: Date,
    RMPaid: Number,
  },
  { versionKey: false }
);

export default mongoose.model("Worker", workerSchema);
