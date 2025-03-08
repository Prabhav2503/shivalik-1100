import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb";
import CommonroomBooking from "@/app/models/CommonroomBooking";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { date, timeSlots, name, phone, purpose } = await req.json();

    if (!date || !timeSlots.length || !name || !phone || !purpose) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await CommonroomBooking.create({ date, timeSlots, name, phone, purpose });

    return NextResponse.json({ message: "Common room booked successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving booking:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const date = req.nextUrl.searchParams.get("date");

    if (!date) {
      return NextResponse.json({ message: "Date is required" }, { status: 400 });
    }

    const bookings = await CommonroomBooking.find({ date });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
