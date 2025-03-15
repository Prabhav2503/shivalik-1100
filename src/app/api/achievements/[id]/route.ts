// app/api/achievements/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb";
import Achievement from "@/app/models/Achievement";
import cloudinary from "@/libs/cloudinary";

// GET - Fetch a specific achievement
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const achievement = await Achievement.findById(params.id);
    
    if (!achievement) {
      return NextResponse.json({ message: "Achievement not found" }, { status: 404 });
    }
    
    return NextResponse.json(achievement);
  } catch (error) {
    console.error("Error fetching achievement:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT - Update an achievement
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      
      // Get form fields
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const order = formData.get("order") ? Number(formData.get("order")) : undefined;
      const keepExistingImages = formData.get("keepExistingImages") === "true";
      
      // Validate required fields
      if (!title || !description) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
      
      await connectToDatabase();
      
      // Find the existing achievement
      const achievement = await Achievement.findById(params.id);
      
      if (!achievement) {
        return NextResponse.json({ message: "Achievement not found" }, { status: 404 });
      }
      
      // Handle image uploads
      let imageUrls: string[] = keepExistingImages ? [...achievement.images] : [];
      
      // If not keeping existing images, delete them from Cloudinary
      if (!keepExistingImages && achievement.images && achievement.images.length > 0) {
        for (const imageUrl of achievement.images) {
          try {
            // Extract public_id from URL
            const urlParts = imageUrl.split('/');
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
      }
      
      // Get all files from formData with name containing 'image'
      const imageFiles: File[] = [];
      for (const [key, value] of formData.entries()) {
        if (key.includes('image') && value instanceof File && value.size > 0) {
          imageFiles.push(value);
        }
      }
      
      // Process new image uploads
      for (const imageFile of imageFiles) {
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
      
      // Update achievement
      achievement.title = title;
      achievement.description = description;
      achievement.images = imageUrls;
      if (order !== undefined) achievement.order = order;
      
      await achievement.save();
      
      return NextResponse.json({ message: "Achievement updated successfully" });
    } 
    else {
      // Handle JSON request
      const data = await req.json();
      
      await connectToDatabase();
      
      // Handle deleting images if specified
      if (data.deleteImages && Array.isArray(data.deleteImages)) {
        const achievement = await Achievement.findById(params.id);
        if (achievement) {
          for (const imageUrl of data.deleteImages) {
            // Remove from images array
            achievement.images = achievement.images.filter(url => url !== imageUrl);
            
            // Delete from Cloudinary
            try {
              // Extract public_id from URL
              const urlParts = imageUrl.split('/');
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
          
          await achievement.save();
        }
      }
      
      // Update other fields
      const updateData = { ...data };
      delete updateData.deleteImages; // Remove the deleteImages property
      
      // Find and update the achievement
      const updatedAchievement = await Achievement.findByIdAndUpdate(
        params.id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      if (!updatedAchievement) {
        return NextResponse.json({ message: "Achievement not found" }, { status: 404 });
      }
      
      return NextResponse.json({ message: "Achievement updated successfully" });
    }
  } catch (error) {
    console.error("Error updating achievement:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE - Remove an achievement
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Find the achievement to get image URLs
    const achievement = await Achievement.findById(params.id);
    
    if (!achievement) {
      return NextResponse.json({ message: "Achievement not found" }, { status: 404 });
    }
    
    // Delete images from Cloudinary
    if (achievement.images && achievement.images.length > 0) {
      for (const imageUrl of achievement.images) {
        try {
          // Extract public_id from URL
          const urlParts = imageUrl.split('/');
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
    }
    
    // Delete the achievement
    await Achievement.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: "Achievement deleted successfully" });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}