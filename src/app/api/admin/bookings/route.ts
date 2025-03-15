// app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb";
import CommonroomBooking from "@/app/models/CommonroomBooking";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get current month's range
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    
    // Format month as MM (with leading zero if needed)
    const monthStr = currentMonth.toString().padStart(2, '0');
    
    // We'll search for bookings where the date starts with YYYY-MM
    const monthPrefix = `${currentYear}-${monthStr}`;
    
    // Find all bookings for the current month using regex
    // This assumes dates are stored in YYYY-MM-DD format
    const bookings = await CommonroomBooking.find({
      date: { $regex: `^${monthPrefix}` }
    }).sort({ date: 1 });
    
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get booking ID from query parameters
    const id = req.nextUrl.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ message: "Booking ID is required" }, { status: 400 });
    }
    
    // Find and delete the booking
    const result = await CommonroomBooking.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Booking deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}