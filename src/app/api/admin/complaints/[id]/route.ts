import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb";
import Complains from "@/app/models/complains";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const deletedComplaint = await Complains.findByIdAndDelete(params.id);

    if (!deletedComplaint) {
      return NextResponse.json({ message: "Complaint not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Complaint deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting complaint" }, { status: 500 });
  }
}
