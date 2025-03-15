// app/api/team/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb";
import TeamMember from "@/app/models/TeamMember";
import cloudinary from "@/libs/cloudinary";

// GET - Fetch a specific team member
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const teamMember = await TeamMember.findById(params.id);
    
    if (!teamMember) {
      return NextResponse.json({ message: "Team member not found" }, { status: 404 });
    }
    
    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT - Update a team member
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      
      // Get form fields
      const name = formData.get("name") as string;
      const role = formData.get("role") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const order = formData.get("order") ? Number(formData.get("order")) : undefined;
      const imageFile = formData.get("image") as File | null;
      
      // Validate required fields
      if (!name || !role || !email || !phone) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
      
      await connectToDatabase();
      
      // Find the existing team member
      const teamMember = await TeamMember.findById(params.id);
      
      if (!teamMember) {
        return NextResponse.json({ message: "Team member not found" }, { status: 404 });
      }
      
      // Handle image upload if present
      let imageUrl = teamMember.imageUrl; // Keep existing image by default
      
      if (imageFile) {
        // Delete old image if exists
        if (teamMember.imageUrl) {
          try {
            // Extract public_id from URL
            const urlParts = teamMember.imageUrl.split('/');
            const filenameWithExtension = urlParts[urlParts.length - 1];
            const publicId = filenameWithExtension.split('.')[0];
            
            // Get folder path
            const folderPath = urlParts[urlParts.length - 2];
            
            // Combine for full public_id
            let fullPublicId = publicId;
            if (folderPath && folderPath !== 'upload') {
              fullPublicId = `${folderPath}/${publicId}`;
            }
            
            await cloudinary.uploader.destroy(fullPublicId);
          } catch (cloudinaryError) {
            console.error("Error deleting old image:", cloudinaryError);
          }
        }
        
        // Upload new image
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64String = buffer.toString('base64');
        const dataURI = `data:${imageFile.type};base64,${base64String}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "hostel-team",
        });
        
        imageUrl = result.secure_url;
      }
      
      // Update team member
      teamMember.name = name;
      teamMember.role = role;
      teamMember.email = email;
      teamMember.phone = phone;
      if (order !== undefined) teamMember.order = order;
      if (imageUrl) teamMember.imageUrl = imageUrl;
      
      await teamMember.save();
      
      return NextResponse.json({ message: "Team member updated successfully" });
    } 
    else {
      // Handle JSON request
      const data = await req.json();
      
      await connectToDatabase();
      
      // Find and update the team member
      const teamMember = await TeamMember.findByIdAndUpdate(
        params.id,
        { $set: data },
        { new: true, runValidators: true }
      );
      
      if (!teamMember) {
        return NextResponse.json({ message: "Team member not found" }, { status: 404 });
      }
      
      return NextResponse.json({ message: "Team member updated successfully" });
    }
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE - Remove a team member
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Find the team member to get image URL
    const teamMember = await TeamMember.findById(params.id);
    
    if (!teamMember) {
      return NextResponse.json({ message: "Team member not found" }, { status: 404 });
    }
    
    // Delete image from Cloudinary if exists
    if (teamMember.imageUrl) {
      try {
        // Extract public_id from URL
        const urlParts = teamMember.imageUrl.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = filenameWithExtension.split('.')[0];
        
        // Get folder path
        const folderPath = urlParts[urlParts.length - 2];
        
        // Combine for full public_id
        let fullPublicId = publicId;
        if (folderPath && folderPath !== 'upload') {
          fullPublicId = `${folderPath}/${publicId}`;
        }
        
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image:", cloudinaryError);
      }
    }
    
    // Delete the team member
    await TeamMember.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}