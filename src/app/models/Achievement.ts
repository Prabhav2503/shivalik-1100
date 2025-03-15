// app/models/Achievement.ts
import mongoose, { Schema, Document } from "mongoose";

interface IAchievement extends Document {
  title: string;
  description: string;
  images: string[]; // Array of Cloudinary image URLs
  order?: number; // Optional field to control display order
}

const AchievementSchema = new Schema<IAchievement>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [], // Default to empty array
    },
    order: {
      type: Number,
      default: 0, // Default order, lower numbers will appear first
    },
  },
  { timestamps: true }
);

const Achievement = mongoose.models.Achievement || mongoose.model<IAchievement>("Achievement", AchievementSchema);

export default Achievement;