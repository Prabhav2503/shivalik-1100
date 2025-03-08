import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb";
import Complains from "@/app/models/complains";

export async function GET() {
  try {
    await connectToDatabase();
    const complaints = await Complains.find().sort({ createdAt: -1 }); // Latest first
    return NextResponse.json(complaints);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching complaints" }, { status: 500 });
  }
}
