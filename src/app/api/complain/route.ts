import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb"; // Import DB connection
import Complains from "@/app/models/complains"; // Import model

export async function POST(req: NextRequest) {
  try {
    // Ensure the database is connected
    await connectToDatabase();

    const { complainType, title, description } = await req.json();

    if (!complainType || !title || !description) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newComplaint = new Complains({ complainType, title, description });
    await newComplaint.save();

    return NextResponse.json({ message: "Complaint submitted successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error saving complaint:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
