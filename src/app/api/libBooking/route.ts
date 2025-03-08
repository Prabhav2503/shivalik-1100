import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb"; // Ensure the DB connection is imported
import LibraryBooking from "@/app/models/LibraryBooking"; // Import model

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure database connection

    const { date, duration, book } = await req.json();

    if (!date || !duration || !book) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const newBooking = new LibraryBooking({
      date: new Date(date),
      duration,
      book,
    });

    await newBooking.save();

    return NextResponse.json({ message: "Library booking successful!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving library booking:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
