"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Complaint {
  _id: string;
  complainType: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
}

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get<Complaint[]>("/api/admin/complaints");
      setComplaints(response.data);
    } catch {
      setError("Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl?: string) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      // Delete the complaint and its image if it exists
      await axios.delete(`/api/admin/complaints/${id}`, {
        params: { imageUrl } // Send imageUrl as a query parameter instead of in the request body
      });
      
      setComplaints((prev) => prev.filter((complaint) => complaint._id !== id));
    } catch {
      setError("Failed to delete complaint.");
    }
  };

  // Function to open expanded image view
  const handleImageClick = (imageUrl: string) => {
    setExpandedImage(imageUrl);
  };

  // Function to close expanded image view
  const closeExpandedImage = () => {
    setExpandedImage(null);
  };

  if (loading) return <p className="text-center text-white">Loading complaints...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Complaints</h1>

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-600 px-4 py-2">Type</th>
                <th className="border border-gray-600 px-4 py-2">Title</th>
                <th className="border border-gray-600 px-4 py-2">Description</th>
                <th className="border border-gray-600 px-4 py-2">Image</th>
                <th className="border border-gray-600 px-4 py-2">Created At</th>
                <th className="border border-gray-600 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id} className="border border-gray-600">
                  <td className="border border-gray-600 px-4 py-2">{complaint.complainType}</td>
                  <td className="border border-gray-600 px-4 py-2">{complaint.title}</td>
                  <td className="border border-gray-600 px-4 py-2">{complaint.description}</td>
                  <td className="border border-gray-600 px-4 py-2 text-center">
                    {complaint.imageUrl ? (
                      <div className="relative h-20 w-20 mx-auto cursor-pointer">
                        <Image
                          src={complaint.imageUrl}
                          alt="Complaint image"
                          fill
                          className="object-cover rounded"
                          onClick={() => handleImageClick(complaint.imageUrl!)}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {new Date(complaint.createdAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    <button
                      onClick={() => handleDelete(complaint._id, complaint.imageUrl)}
                      className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expanded image modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeExpandedImage}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-2">
            <button
              onClick={closeExpandedImage}
              className="absolute top-4 right-4 bg-red-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold z-10"
            >
              ×
            </button>
            <div className="relative w-full h-[80vh]">
              <Image
                src={expandedImage}
                alt="Expanded complaint image"
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;