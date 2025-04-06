// app/api/admin/libraryBookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb";
import LibraryBooking from "@/app/models/LibraryBooking";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get current month's range
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    
    // Create date range for the current month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1); // Month is 0-indexed in Date constructor
    const endOfMonth = new Date(currentYear, currentMonth, 0); // Last day of current month
    
    // Find all bookings for the current month using date range
    const bookings = await LibraryBooking.find({
      date: { 
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    }).sort({ date: 1 });
    
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin library bookings:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get booking ID from query parameters
    const id = req.nextUrl.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ message: "Booking ID is required" }, { status: 400 });
    }
    
    // Get the new status from request body
    const data = await req.json();
    const { status } = data;
    
    if (!status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 });
    }
    
    // Validate status value
    const validStatuses = ["pending", "lended", "returned"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
    }
    
    // Find and update the booking
    const updatedBooking = await LibraryBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );
    
    if (!updatedBooking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Error updating booking status:", error);
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
    const result = await LibraryBooking.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Booking deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}