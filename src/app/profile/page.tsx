"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Footer from "../components/MyFooter";

const BACKEND = "http://localhost:5000";

interface Profile {
  id: string;
  name: string;
  image: string | null;
  kerboros: string;
  designation: string[];
  room_number: string;
}

interface MeResponse {
  user?: {
    userid?: string;
    role?: string[];
    name?: string | null;
    image?: string | null;
    room_number?: string | null;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const me = await axios.get<MeResponse>(`${BACKEND}/api/me`, {
          withCredentials: true,
        });
        if (!me.data?.user?.userid) throw new Error("Not logged in");
        setRoles(Array.isArray(me.data.user.role) ? me.data.user.role : []);
        const p = await axios.get<{ data: Profile }>(`${BACKEND}/api/profile/me`, {
          withCredentials: true,
        });
        setProfile(p.data.data);
      } catch {
        setError("Please login to view your profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const getInitials = (name: string) =>
    name.split(" ").map((part) => part[0]).join("").toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axios.post(`${BACKEND}/api/logout`, {}, { withCredentials: true });
      router.push("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-premium flex items-center justify-center">
        <div className="w-12 h-12 spinner" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <>
        <div className="page-section">
          <div className="page-blob-blue" />
          <div className="page-blob-gold" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto glass-card p-10 text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-3">Profile</h1>
            <p className="text-red-400 mb-6">{error}</p>
            <Link href="/login" className="btn-primary inline-block">
              Go to Login
            </Link>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="page-section">
        <div className="page-blob-blue" />
        <div className="page-blob-gold" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-card overflow-hidden">
            {/* Header bar */}
            <div className="px-8 py-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-primary/10 to-transparent">
              <div>
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                <p className="text-gray-400 mt-1 text-sm">Your account information</p>
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="btn-danger self-start sm:self-auto"
              >
                {loggingOut ? "Logging out…" : "Logout"}
              </button>
            </div>

            {/* Body */}
            <div className="p-8">
              {/* Avatar + name */}
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
                {profile.image ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-primary/60 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <Image src={profile.image} alt={profile.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-2xl font-bold ring-2 ring-primary/60 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex-shrink-0">
                    {getInitials(profile.name)}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-semibold text-white">{profile.name}</h2>
                  <p className="text-gray-400 mt-1 text-sm">{profile.kerboros}</p>
                </div>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="glass p-5 rounded-xl border border-white/10 hover:border-primary/30 transition-colors"
                >
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Room Number</p>
                  <p className="text-xl text-white font-medium">{profile.room_number || "N/A"}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="glass p-5 rounded-xl border border-white/10 hover:border-primary/30 transition-colors"
                >
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Roles</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(roles.length ? roles : profile.designation || []).map((role, idx) => (
                      <span key={`${role}-${idx}`} className="badge-primary">
                        {role}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
