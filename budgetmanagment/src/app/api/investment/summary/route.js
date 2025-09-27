import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb.js";
import User from "../../../models/user.js";
import Investment from "../../../models/investment.js";

export async function GET(req) {
  try {
    await connectDB();

    // Get email from query string
    const { searchParams } = new URL(req.url);
    const email =  "vaibhav@example.com";
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Fetch all investments for this user
    const investments = await Investment.find({ user: user._id });

    // Group by month
    const summary = investments.reduce((acc, inv) => {
      if (!acc[inv.month]) acc[inv.month] = 0;
      acc[inv.month] += inv.amount;
      return acc;
    }, {});

    return NextResponse.json({ message: "Monthly summary fetched", summary }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error fetching summary", error: err.message }, { status: 500 });
  }
}
