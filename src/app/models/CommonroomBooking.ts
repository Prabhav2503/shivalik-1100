import mongoose, { Schema, Document } from "mongoose";

interface ICommonroomBooking extends Document {
  date: string;
  timeSlots: string[];
  name: string;
  phone: string;
  purpose: string;
}

const CommonroomBookingSchema = new Schema<ICommonroomBooking>({
  date: { type: String, required: true },
  timeSlots: { type: [String], required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  purpose: { type: String, required: true },
});

export default mongoose.models.CommonroomBooking || mongoose.model<ICommonroomBooking>("CommonroomBooking", CommonroomBookingSchema);
