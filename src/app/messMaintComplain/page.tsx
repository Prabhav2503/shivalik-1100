"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import Head from "next/head";
import Footer from "../components/MyFooter";
import Image from "next/image";

export default function ComplaintForm() {
  const [complaintType, setComplaintType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle image file selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    // Create a preview URL for the selected image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // If there's an image, use FormData to send the request
      if (imageFile) {
        const formData = new FormData();
        formData.append("complainType", complaintType);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("image", imageFile);

        const response = await axios.post("/api/complain", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage("Complaint submitted successfully!");
      } else {
        // Without image, use JSON as before
        const response = await axios.post("/api/complain", {
          complainType: complaintType,
          title,
          description,
        });

        setMessage("Complaint submitted successfully!");
      }

      // Reset form
      setComplaintType("");
      setTitle("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      
      // Reset the file input
      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setMessage("Error submitting complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen w-full px-4 py-8" style={{backgroundColor:"rgb(23,23,23)"}}>
        <Head>
          <title>Submit a Complaint</title>
        </Head>

        <div className="w-full max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">Submit a Complaint</h1>
          <p className="text-center text-gray-400 mb-8 text-base md:text-lg">Report issues for quick resolution</p>

          {message && <p className="text-center text-green-500 mb-4 text-base md:text-lg">{message}</p>}

          <form onSubmit={handleSubmit} className="p-6 rounded-lg" style={{backgroundColor:"rgb(38,38,38)"}}>
            <div className="mb-4">
              <label className="block text-white text-base md:text-lg mb-3">Complaint Type</label>
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="complaintType" 
                    value="Mess" 
                    checked={complaintType === "Mess"}
                    onChange={() => setComplaintType("Mess")} 
                    className="mr-2 w-5 h-5" 
                  />
                  <span className="text-white text-base md:text-lg">Mess</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="complaintType" 
                    value="Maintanence" 
                    checked={complaintType === "Maintanence"}
                    onChange={() => setComplaintType("Maintanence")} 
                    className="mr-2 w-5 h-5"
                  />
                  <span className="text-white text-base md:text-lg">Maintanence</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="title" className="block text-white text-base md:text-lg mb-3">Title</label>
              <input 
                type="text" 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full px-3 py-3 rounded text-white border-0 text-base md:text-lg" 
                style={{backgroundColor:"rgb(64,64,64)"}}
                required 
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-white text-base md:text-lg mb-3">Description</label>
              <textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full px-3 py-3 rounded bg-gray-700 text-white border-0 h-24 text-base md:text-lg" 
                style={{backgroundColor:"rgb(64,64,64)"}}
                required
              ></textarea>
            </div>

            {/* Image upload section */}
            <div className="mb-4">
              <label htmlFor="image" className="block text-white text-base md:text-lg mb-3">
                Add Image (Optional)
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-3 rounded  text-white border-0 text-base md:text-lg"
                style={{backgroundColor:"rgb(64,64,64)"}}
              />
              
              {/* Image preview */}
              {imagePreview && (
                <div className="mt-3 relative">
                  <div className="relative h-64 w-full bg-gray-700 rounded overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700 transition-colors disabled:bg-gray-500 text-base md:text-lg" 
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}