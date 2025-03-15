// app/api/admin/complaints/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb";
import Complains from "@/app/models/complains";
import cloudinary from "@/libs/cloudinary";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Extract the image URL from the request body (if provided)
    const body = await req.json().catch(() => ({}));
    const { imageUrl } = body;
    
    // Delete the complaint from the database
    const deletedComplaint = await Complains.findByIdAndDelete(params.id);
    
    if (!deletedComplaint) {
      return NextResponse.json({ message: "Complaint not found" }, { status: 404 });
    }
    
    // If there was an image associated with the complaint, delete it from Cloudinary
    if (imageUrl) {
      try {
        // Extract the public_id from the Cloudinary URL
        // The URL format is typically: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/folder/public_id.jpg
        const urlParts = imageUrl.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = filenameWithExtension.split('.')[0]; // Remove file extension
        
        // Get the folder path (if any)
        const folderPath = urlParts[urlParts.length - 2];
        
        // Combine folder and public ID
        let fullPublicId = publicId;
        if (folderPath && folderPath !== 'upload') {
          fullPublicId = `${folderPath}/${publicId}`;
        }
        
        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(fullPublicId);
        console.log(`Deleted image from Cloudinary: ${fullPublicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // We continue even if image deletion fails
      }
    }
    
    return NextResponse.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}