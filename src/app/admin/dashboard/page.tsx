"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const response = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("token"); // Remove invalid token
        router.push("/admin/login"); // Redirect back to login
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {user?.username}!</p>

      <div className="mt-6 space-y-4">
        <a href="/admin/complaints" className="block bg-red-500 px-4 py-2 rounded">Manage Complaints</a>
        <a href="/admin/bookings" className="block bg-blue-500 px-4 py-2 rounded">View Bookings</a>
        <a href="/admin/mess" className="block bg-green-500 px-4 py-2 rounded">Edit Mess Menu</a>
      </div>

      <button
        className="mt-6 bg-gray-600 px-4 py-2 rounded"
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/admin/login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
