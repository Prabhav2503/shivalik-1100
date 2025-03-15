// app/api/admin/complaints/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb";
import Complains from "@/app/models/complains";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Fetch all complaints, sorted by newest first
    const complaints = await Complains.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}