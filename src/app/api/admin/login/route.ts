import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Hardcoded Admin Users
const admins = [
  { username: "admin1", password: "password123" },
  { username: "admin2", password: "securepass" },
  { username: "admin3", password: "letmein123" },
];

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Find admin
    const admin = admins.find((a) => a.username === username);
    if (!admin || admin.password !== password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET!, { expiresIn: "1d" });

    return NextResponse.json({ message: "Login successful", token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
