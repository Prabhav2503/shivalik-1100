import mongoose, { Schema, Document } from "mongoose";

interface ILibraryBooking extends Document {
  date: Date; // Stores starting date from the calendar UI
  duration: number; // in days
  book: string; // Book title

}

const LibraryBookingSchema = new Schema<ILibraryBooking>({
  date: { type: Date, required: true }, // Stores full date object (e.g., "2025-03-08T00:00:00Z")
  duration: { type: Number, required: true }, // Number of days
  book: { type: String, required: true }, // Book title as string
});

export default mongoose.model<ILibraryBooking>("LibraryBooking", LibraryBookingSchema);
