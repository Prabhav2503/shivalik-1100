// app/api/complain/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb";
import Complains from "@/app/models/complains";
import cloudinary from "@/libs/cloudinary";

export async function POST(req: NextRequest) {
  try {
    // Check if the request is multipart/form-data
    const contentType = req.headers.get("content-type") || "";
    
    // If it's a form data request (with file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      
      // Get form fields
      const complainType = formData.get("complainType") as string;
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const imageFile = formData.get("image") as File | null;
      
      // Validate required fields
      if (!complainType || !title || !description) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
      
      await connectToDatabase();
      
      // Handle image upload if present
      let imageUrl = "";
      if (imageFile) {
        // Convert file to buffer
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Convert buffer to base64
        const base64String = buffer.toString('base64');
        const dataURI = `data:${imageFile.type};base64,${base64String}`;
        
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "hostel-complaints",
        });
        
        imageUrl = result.secure_url;
      }
      
      // Create and save the complaint
      const newComplaint = new Complains({
        complainType,
        title,
        description,
        imageUrl: imageUrl || undefined,
      });
      
      await newComplaint.save();
      
      return NextResponse.json({ message: "Complaint submitted successfully" }, { status: 201 });
    } 
    // If it's a JSON request (without file upload)
    else {
      const { complainType, title, description } = await req.json();
      
      if (!complainType || !title || !description) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
      
      await connectToDatabase();
      
      const newComplaint = new Complains({ complainType, title, description });
      await newComplaint.save();
      
      return NextResponse.json({ message: "Complaint submitted successfully" }, { status: 201 });
    }
  } catch (error) {
    console.error("Error saving complaint:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}