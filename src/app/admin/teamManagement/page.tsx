"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import axios from "axios";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  imageUrl?: string;
  order?: number;
}

export default function AdminTeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/team");
      setTeamMembers(response.data);
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Failed to load team members.");
    } finally {
      setLoading(false);
    }
  };

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

  const resetForm = () => {
    setName("");
    setRole("");
    setEmail("");
    setPhone("");
    setOrder(0);
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
    setError("");
    setSuccess("");
    // Reset file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("order", order.toString());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEditing && editId) {
        // Update existing team member
        await axios.put(`/api/team/${editId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Team member updated successfully!");
      } else {
        // Add new team member
        await axios.post("/api/team", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Team member added successfully!");
      }

      // Refresh the team members list
      fetchTeamMembers();
      resetForm();
    } catch (err) {
      console.error("Error saving team member:", err);
      setError("Failed to save team member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setIsEditing(true);
    setEditId(member._id);
    setName(member.name);
    setRole(member.role);
    setEmail(member.email);
    setPhone(member.phone);
    setOrder(member.order || 0);
    setImagePreview(member.imageUrl || null);
    setSuccess("");
    setError("");

    // Scroll to form
    const formElement = document.getElementById('teamForm');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) {
      return;
    }

    try {
      await axios.delete(`/api/team/${id}`);
      setTeamMembers(prev => prev.filter(member => member._id !== id));
      setSuccess("Team member deleted successfully!");
      
      // If we were editing this member, reset the form
      if (editId === id) {
        resetForm();
      }
    } catch (err) {
      console.error("Error deleting team member:", err);
      setError("Failed to delete team member.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Team Management</h1>

      {/* Form */}
      <div className="bg-gray-800 p-6 rounded-lg mb-10" id="teamForm">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Team Member" : "Add New Team Member"}
        </h2>

        {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-500 text-white p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
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

          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-1">Profile Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
            />
            <p className="text-xs text-gray-400 mt-1">
              {isEditing && !imageFile ? "Leave empty to keep current image" : "Optional - initials will be used if no image is provided"}
            </p>
          </div>

          {/* Image preview */}
          {imagePreview && (
            <div className="mt-2">
              <div className="relative h-40 w-40">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-full"
                />
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
                  ? "Update Member" 
                  : "Add Member"}
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

      {/* Team Members List */}
      <h2 className="text-xl font-semibold mb-4">Team Members</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : teamMembers.length === 0 ? (
        <p className="text-gray-400">No team members found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-600 px-4 py-2 text-left">Order</th>
                <th className="border border-gray-600 px-4 py-2 text-left">Image</th>
                <th className="border border-gray-600 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-600 px-4 py-2 text-left">Role</th>
                <th className="border border-gray-600 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-600 px-4 py-2 text-left">Phone</th>
                <th className="border border-gray-600 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member._id} className="border-t border-gray-600">
                  <td className="border border-gray-600 px-4 py-2">{member.order || 0}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    {member.imageUrl ? (
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {member.name.split(' ').map(part => part[0]).join('').toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">{member.name}</td>
                  <td className="border border-gray-600 px-4 py-2">{member.role}</td>
                  <td className="border border-gray-600 px-4 py-2">{member.email}</td>
                  <td className="border border-gray-600 px-4 py-2">{member.phone}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}