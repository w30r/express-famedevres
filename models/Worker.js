import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    name: String,
    phoneNumber: String,
    passportNumber: String,
    passportExpiry: Date,
    visaExpiry: Date,
    RMPaid: Number,
    status: String,
    transactions: [
      {
        date: Date,
        amount: Number,
        note: String,
      },
    ],
  },
  { versionKey: false }
);

export default mongoose.model("Worker", workerSchema);
