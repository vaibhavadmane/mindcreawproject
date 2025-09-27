import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to user
  month: { type: String, required: true },
  category: { type: String },
  amount: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Investment || mongoose.model("Investment", investmentSchema);
