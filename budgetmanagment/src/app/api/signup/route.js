import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "../../lib/mongodb.js";
import User from "../../models/user.js";


export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error registering user", error: err.message }, { status: 500 });
  }
}
