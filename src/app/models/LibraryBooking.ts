// app/models/LibraryBooking.ts
import mongoose, { Schema, Document } from "mongoose";

interface ILibraryBooking extends Document {
  date: Date;       // Stores starting date from the calendar UI
  duration: number; // in days
  book: string;     // Book title
  status: string;   // pending, lended, returned
  createdAt: Date;
  updatedAt: Date;
}

const LibraryBookingSchema = new Schema<ILibraryBooking>({
  date: { 
    type: Date, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true 
  },
  book: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'lended', 'returned'],
    default: 'pending'
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt fields
});

// Use mongoose.models to check if the model already exists to prevent overwriting
const LibraryBooking = mongoose.models.LibraryBooking || 
  mongoose.model<ILibraryBooking>("LibraryBooking", LibraryBookingSchema);

export default LibraryBooking;