import mongoose, { Schema, Document } from "mongoose";

interface Complains extends Document {
  complainType: string;
  title: string;
  description: string;
  imageUrl?: string; // Optional field for image URL
}

const complainsSchema: Schema = new Schema(
  {
    complainType: {
      type: String,
      required: true,
      enum: ["Mess", "Maintanence"],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false, // Optional field
    },
  },
  { timestamps: true }
);

const Complains = mongoose.models.Complains || mongoose.model<Complains>("Complains", complainsSchema);

export default Complains;