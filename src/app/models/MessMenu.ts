import mongoose, { Schema, Document } from "mongoose";

interface IMeal {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

interface IDayMenu {
  day: string; // Example: "Monday"
  meals: IMeal;
}

interface IMessMenu extends Document {
//   weekStartDate: Date; // Optional: If you want to track weekly menus
  menu: IDayMenu[];
}

const MessMenuSchema = new Schema<IMessMenu>({
//   weekStartDate: { type: Date, required: false }, // Can be used to track menu versions
  menu: [
    {
      day: { type: String, required: true }, // e.g., "Monday"
      meals: {
        breakfast: { type: [String], required: true }, // List of breakfast items
        lunch: { type: [String], required: true }, // List of lunch items
        dinner: { type: [String], required: true }, // List of dinner items
      },
    },
  ],
});

export default mongoose.model<IMessMenu>("MessMenu", MessMenuSchema);
