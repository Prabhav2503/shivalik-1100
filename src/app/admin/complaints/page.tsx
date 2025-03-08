"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Complaint {
  _id: string;
  complainType: string;
  title: string;
  description: string;
  createdAt: string;
}

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get("/api/admin/complaints");
      setComplaints(response.data);
    } catch (error) {
      setError("Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      await axios.delete(`/api/admin/complaints/${id}`);
      setComplaints((prev) => prev.filter((complaint) => complaint._id !== id));
    } catch (error) {
      setError("Failed to delete complaint.");
    }
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
                  <td className="border border-gray-600 px-4 py-2">
                    {new Date(complaint.createdAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    <button
                      onClick={() => handleDelete(complaint._id)}
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
    </div>
  );
};

export default AdminComplaints;
