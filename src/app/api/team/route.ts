// app/api/team/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb";
import TeamMember from "@/app/models/TeamMember";
import cloudinary from "@/libs/cloudinary";

// GET - Fetch all team members
export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all team members, sorted by order field (ascending)
    const teamMembers = await TeamMember.find({})
      .sort({ order: 1 })
      .lean();
    
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST - Add a new team member (with image upload)
export async function POST(req: NextRequest) {
  try {
    // Check if the request is multipart/form-data
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      
      // Get form fields
      const name = formData.get("name") as string;
      const role = formData.get("role") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const order = formData.get("order") ? Number(formData.get("order")) : 0;
      const imageFile = formData.get("image") as File | null;
      
      // Validate required fields
      if (!name || !role || !email || !phone) {
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
          folder: "hostel-team",
        });
        
        imageUrl = result.secure_url;
      }
      
      // Create and save the team member
      const newTeamMember = new TeamMember({
        name,
        role,
        email,
        phone,
        imageUrl: imageUrl || undefined,
        order,
      });
      
      await newTeamMember.save();
      
      return NextResponse.json({ message: "Team member added successfully" }, { status: 201 });
    } 
    else {
      // Handle JSON request
      const { name, role, email, phone, order } = await req.json();
      
      if (!name || !role || !email || !phone) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
      
      await connectToDatabase();
      
      const newTeamMember = new TeamMember({
        name,
        role,
        email,
        phone,
        order: order || 0,
      });
      
      await newTeamMember.save();
      
      return NextResponse.json({ message: "Team member added successfully" }, { status: 201 });
    }
  } catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}