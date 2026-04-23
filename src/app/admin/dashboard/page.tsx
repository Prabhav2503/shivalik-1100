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
        const response = await axios.get<{ username: string }>("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch {
        localStorage.removeItem("token"); // Remove invalid token
        router.push("/admin/login"); // Redirect back to login
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <p className="text-center text-white">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {user?.username}!</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <a
          href="/admin/complaints"
          className="block bg-red-500 hover:bg-red-600 px-4 py-3 rounded text-center transition-colors"
        >
          Manage Complaints
        </a>
        <a
          href="/admin/bookings"
          className="block bg-blue-500 hover:bg-blue-600 px-4 py-3 rounded text-center transition-colors"
        >
          View Bookings
        </a>
        <a
          href="/admin/messmenu"
          className="block bg-green-500 hover:bg-green-600 px-4 py-3 rounded text-center transition-colors"
        >
          Edit Mess Menu
        </a>
        <a
          href="/admin/teamManagement"
          className="block bg-purple-500 hover:bg-purple-600 px-4 py-3 rounded text-center transition-colors"
        >
          Team Management
        </a>
        <a
          href="/admin/achievements"
          className="block bg-yellow-500 hover:bg-yellow-600 px-4 py-3 rounded text-center transition-colors"
        >
          Achievement Management
        </a>
      </div>

      <button
        className="mt-6 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
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
