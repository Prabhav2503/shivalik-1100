// app/models/TeamMember.ts
import mongoose, { Schema, Document } from "mongoose";

interface ITeamMember extends Document {
  name: string;
  role: string;
  email: string;
  phone: string;
  imageUrl?: string; // Optional image URL from Cloudinary
  order?: number; // Optional field to control display order
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false, // Optional field
    },
    order: {
      type: Number,
      default: 0, // Default order, lower numbers will appear first
    },
  },
  { timestamps: true }
);

// Generate initials from the name if needed
TeamMemberSchema.virtual('initials').get(function() {
  if (!this.name) return '';
  
  return this.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
});

const TeamMember = mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);

export default TeamMember;