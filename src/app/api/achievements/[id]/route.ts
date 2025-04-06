// app/api/achievements/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb";
import Achievement from "@/app/models/Achievement";
import cloudinary from "@/libs/cloudinary";

// GET - Fetch a specific achievement
export async function GET(
  request: NextRequest,
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const id = params.id;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const order = formData.get("order") ? Number(formData.get("order")) : undefined;
      const keepExistingImages = formData.get("keepExistingImages") === "true";

      if (!title || !description) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }

      await connectToDatabase();
      const achievement = await Achievement.findById(id);
      if (!achievement) {
        return NextResponse.json({ message: "Achievement not found" }, { status: 404 });
      }

      const imageUrls: string[] = keepExistingImages ? [...achievement.images] : [];

      if (!keepExistingImages && achievement.images?.length > 0) {
        for (const imageUrl of achievement.images) {
          try {
            const urlParts = imageUrl.split('/');
            const filenameWithExtension = urlParts[urlParts.length - 1];
            const publicId = filenameWithExtension.split('.')[0];
            const folderPath = urlParts[urlParts.length - 2];
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

      const imageFiles: File[] = [];
      for (const [key, value] of formData.entries()) {
        if (key.includes("image") && value instanceof File && value.size > 0) {
          imageFiles.push(value);
        }
      }

      for (const imageFile of imageFiles) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64String = buffer.toString("base64");
        const dataURI = `data:${imageFile.type};base64,${base64String}`;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "hostel-achievements",
        });
        imageUrls.push(result.secure_url);
      }

      achievement.title = title;
      achievement.description = description;
      achievement.images = imageUrls;
      if (order !== undefined) achievement.order = order;
      await achievement.save();

      return NextResponse.json({ message: "Achievement updated successfully" });
    } else {
      const data = await request.json();
      await connectToDatabase();

      if (data.deleteImages && Array.isArray(data.deleteImages)) {
        const achievement = await Achievement.findById(id);
        if (achievement) {
          for (const imageUrl of data.deleteImages) {
            achievement.images = achievement.images.filter((url: string) => url !== imageUrl);
            try {
              const urlParts = imageUrl.split("/");
              const filenameWithExtension = urlParts[urlParts.length - 1];
              const publicId = filenameWithExtension.split(".")[0];
              const folderPath = urlParts[urlParts.length - 2];
              let fullPublicId = publicId;
              if (folderPath && folderPath !== "upload") {
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

      const updateData = { ...data };
      delete updateData.deleteImages;

      const updatedAchievement = await Achievement.findByIdAndUpdate(
        id,
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const achievement = await Achievement.findById(params.id);

    if (!achievement) {
      return NextResponse.json({ message: "Achievement not found" }, { status: 404 });
    }

    if (achievement.images && achievement.images.length > 0) {
      for (const imageUrl of achievement.images) {
        try {
          const urlParts = imageUrl.split("/");
          const filenameWithExtension = urlParts[urlParts.length - 1];
          const publicId = filenameWithExtension.split(".")[0];
          const folderPath = urlParts[urlParts.length - 2];
          let fullPublicId = publicId;
          if (folderPath && folderPath !== "upload") {
            fullPublicId = `${folderPath}/${publicId}`;
          }
          await cloudinary.uploader.destroy(fullPublicId);
        } catch (cloudinaryError) {
          console.error("Error deleting image:", cloudinaryError);
        }
      }
    }

    await Achievement.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Achievement deleted successfully" });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
