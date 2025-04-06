"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import axios from "axios";

interface Achievement {
  _id: string;
  title: string;
  description: string;
  images: string[];
  order?: number;
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [keepExistingImages, setKeepExistingImages] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Achievement[]>("/api/achievements");
      setAchievements(response.data);
    } catch (err) {
      console.error("Error fetching achievements:", err);
      setError("Failed to load achievements.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setImageFiles(prevFiles => [...prevFiles, ...newFiles]);

    // Create previews for new files
    const newPreviews: string[] = [];
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newFiles.length) {
          setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImagePreview = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setOrder(0);
    setImageFiles([]);
    setImagePreviews([]);
    setKeepExistingImages(true);
    setIsEditing(false);
    setEditId(null);
    setError("");
    setSuccess("");
    // Reset file input
    const fileInput = document.getElementById('images') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("order", order.toString());
      
      if (isEditing) {
        formData.append("keepExistingImages", keepExistingImages.toString());
      }

      // Append all image files
      imageFiles.forEach((file, index) => {
        formData.append(`image${index}`, file);
      });

      if (isEditing && editId) {
        // Update existing achievement
        await axios.put(`/api/achievements/${editId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Achievement updated successfully!");
      } else {
        // Add new achievement
        await axios.post("/api/achievements", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Achievement added successfully!");
      }

      // Refresh the achievements list
      fetchAchievements();
      resetForm();
    } catch (err) {
      console.error("Error saving achievement:", err);
      setError("Failed to save achievement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setIsEditing(true);
    setEditId(achievement._id);
    setTitle(achievement.title);
    setDescription(achievement.description);
    setOrder(achievement.order || 0);
    setImagePreviews(achievement.images);
    setImageFiles([]);
    setKeepExistingImages(true);
    setSuccess("");
    setError("");

    // Scroll to form
    const formElement = document.getElementById('achievementForm');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this achievement?")) {
      return;
    }

    try {
      await axios.delete(`/api/achievements/${id}`);
      setAchievements(prev => prev.filter(achievement => achievement._id !== id));
      setSuccess("Achievement deleted successfully!");
      
      // If we were editing this achievement, reset the form
      if (editId === id) {
        resetForm();
      }
    } catch (err) {
      console.error("Error deleting achievement:", err);
      setError("Failed to delete achievement.");
    }
  };

  const handleDeleteImage = async (achievementId: string, imageUrl: string) => {
    if (!window.confirm("Are you sure you want to remove this image?")) {
      return;
    }

    try {
      await axios.put(`/api/achievements/${achievementId}`, {
        deleteImages: [imageUrl]
      });
      
      // Update state to reflect changes
      setAchievements(prev => prev.map(achievement => {
        if (achievement._id === achievementId) {
          return {
            ...achievement,
            images: achievement.images.filter(img => img !== imageUrl)
          };
        }
        return achievement;
      }));
      
      // If this achievement is being edited, update previews
      if (editId === achievementId) {
        setImagePreviews(prev => prev.filter(url => url !== imageUrl));
      }
      
      setSuccess("Image removed successfully!");
    } catch (err) {
      console.error("Error removing image:", err);
      setError("Failed to remove image.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Achievements Management</h1>

      {/* Form */}
      <div className="bg-gray-800 p-6 rounded-lg mb-10" id="achievementForm">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Achievement" : "Add New Achievement"}
        </h2>

        {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-500 text-white p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white h-24"
              required
            />
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium mb-1">Display Order</label>
            <input
              type="number"
              id="order"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
            />
            <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
          </div>

          {isEditing && (
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepExistingImages}
                  onChange={(e) => setKeepExistingImages(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium">Keep existing images</span>
              </label>
            </div>
          )}

          <div>
            <label htmlFor="images" className="block text-sm font-medium mb-1">Upload Images</label>
            <input
              type="file"
              id="images"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
            />
            <p className="text-xs text-gray-400 mt-1">Upload multiple images for the achievement carousel</p>
          </div>

          {/* Image previews for new uploads */}
          {imagePreviews.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <div className="relative h-40 w-full rounded overflow-hidden bg-gray-700">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        // For existing images from server
                        if (isEditing && index < imagePreviews.length - imageFiles.length) {
                          const achievement = achievements.find(a => a._id === editId);
                          if (achievement) {
                            handleDeleteImage(editId!, preview);
                          }
                        } else {
                          // For newly uploaded images
                          removeImagePreview(index);
                        }
                      }}
                      className="absolute top-2 right-2 bg-red-600 rounded-full p-1 text-white"
                      aria-label="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:bg-purple-800 disabled:cursor-not-allowed"
            >
              {isSubmitting 
                ? "Saving..."
                : isEditing 
                  ? "Update Achievement" 
                  : "Add Achievement"}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Achievements List */}
      <h2 className="text-xl font-semibold mb-4">Achievements</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : achievements.length === 0 ? (
        <p className="text-gray-400">No achievements found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {achievements.map((achievement) => (
            <div key={achievement._id} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{achievement.title}</h3>
                  <p className="text-sm text-gray-400">Order: {achievement.order || 0}</p>
                </div>
                
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => handleEdit(achievement)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(achievement._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <p className="text-gray-400 mb-4">{achievement.description}</p>
              
              {/* Images */}
              {achievement.images && achievement.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Images ({achievement.images.length})</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {achievement.images.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <div className="relative h-24 w-full rounded overflow-hidden bg-gray-700">
                          <Image
                            src={imageUrl}
                            alt={`${achievement.title} image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(achievement._id, imageUrl)}
                          className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white text-xs"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}