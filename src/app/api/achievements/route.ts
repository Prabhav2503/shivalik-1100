// app/api/achievements/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb";
import Achievement from "@/app/models/Achievement";
import cloudinary from "@/libs/cloudinary";

// GET - Fetch all achievements
export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all achievements, sorted by order field (ascending)
    const achievements = await Achievement.find({})
      .sort({ order: 1 })
      .lean();
    
    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST - Add a new achievement (with image uploads)
export async function POST(req: NextRequest) {
  try {
    // Check if the request is multipart/form-data
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      
      // Get form fields
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const order = formData.get("order") ? Number(formData.get("order")) : 0;
      
      // Validate required fields
      if (!title || !description) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
      
      await connectToDatabase();
      
      // Handle multiple image uploads
      const imageUrls: string[] = [];
      
      // Check if there are multiple files
      const imageFiles: File[] = [];
      
      // Get all files from formData with name containing 'image'
      for (const [key, value] of formData.entries()) {
        if (key.includes('image') && value instanceof File) {
          imageFiles.push(value);
        }
      }
      
      // Process each image
      for (const imageFile of imageFiles) {
        if (imageFile.size > 0) {
          // Convert file to buffer
          const arrayBuffer = await imageFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          // Convert buffer to base64
          const base64String = buffer.toString('base64');
          const dataURI = `data:${imageFile.type};base64,${base64String}`;
          
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(dataURI, {
            folder: "hostel-achievements",
          });
          
          imageUrls.push(result.secure_url);
        }
      }
      
      // Create and save the achievement
      const newAchievement = new Achievement({
        title,
        description,
        images: imageUrls,
        order,
      });
      
      await newAchievement.save();
      
      return NextResponse.json({ message: "Achievement added successfully", id: newAchievement._id }, { status: 201 });
    } 
    else {
      // Handle JSON request
      const data = await req.json();
      
      // Validate required fields
      if (!data.title || !data.description) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
      
      await connectToDatabase();
      
      const newAchievement = new Achievement({
        title: data.title,
        description: data.description,
        images: data.images || [],
        order: data.order || 0,
      });
      
      await newAchievement.save();
      
      return NextResponse.json({ message: "Achievement added successfully", id: newAchievement._id }, { status: 201 });
    }
  } catch (error) {
    console.error("Error adding achievement:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}