import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  month: { type: String, required: true },
  category: { type: String },
  amount: { type: Number, required: true },
  description: { type: String },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  transactions: { type: [transactionSchema], default: [] }, // <-- default empty array
});

export default mongoose.models.User || mongoose.model("User", userSchema);
