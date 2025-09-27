import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/user.js";
import Investment from "../../../models/investment.js";

export async function POST(req) {
  try {
    await connectDB();

    const { email, month, category, amount, description } = await req.json();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create new investment linked to this user
    const newInvestment = new Investment({
      user: user._id,
      month,
      category,
      amount,
      description,
    });

    await newInvestment.save();

    return NextResponse.json({
      message: "Investment added successfully",
      investment: newInvestment,
    }, { status: 201 });

  } catch (err) {
    console.error("Error adding investment:", err);
    return NextResponse.json({
      message: "Error adding investment",
      error: err.message,
    }, { status: 500 });
  }
}
