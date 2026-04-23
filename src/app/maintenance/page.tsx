"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/MyFooter";
import axios from "axios";

const BACKEND = "http://localhost:5000";

interface Complaint {
  id: string;
  kerboros: string;
  title: string;
  description: string;
  imageURL: string | null;
  status: "pending" | "resolved";
  created_at: string;
}

interface UserInfo {
  userid: string;
  role: string[];
}

interface CommitteeMember {
  id: string;
  name: string;
  image: string | null;
  kerboros: string;
  designation: string[];
  room_number: string;
}

function MaintCommitteeMembers() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommittee = async () => {
      try {
        setLoading(true);
        const res = await axios.post<{ data: CommitteeMember[] }>(
          `${BACKEND}/api/maint/committee`,
          {},
          { withCredentials: true }
        );
        setMembers(res.data.data || []);
      } catch {
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommittee();
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  return (
    <div className="glass-card p-5 sm:p-6 mb-8">
      <h2 className="text-white text-lg sm:text-xl font-semibold mb-4">Maintenance Committee Members</h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-10 h-10 spinner" />
        </div>
      ) : members.length === 0 ? (
        <p className="text-gray-500 text-sm">No committee members found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => {
            const roles = Array.isArray(member.designation) ? member.designation : [];
            const specificRole =
              roles.find((r) => ["maintSecy", "bhmRep", "maintCommittee"].includes(r)) || "member";

            return (
              <div key={member.id} className="glass rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  {member.image ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-primary/50">
                      <Image src={member.image} alt={member.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white font-semibold text-sm flex items-center justify-center ring-1 ring-primary/50">
                      {getInitials(member.name)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{member.name}</p>
                    <p className="text-primary text-xs capitalize">{specificRole}</p>
                    <p className="text-gray-500 text-xs">{member.kerboros}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MaintenancePage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [kerboros, setKerboros] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  const isPrivileged = (u: UserInfo | null) =>
    u?.role?.some((r) => ["maintSecy", "admin"].includes(r)) ?? false;

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get<{ user: UserInfo }>(`${BACKEND}/api/me`, { withCredentials: true });
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  }, []);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ data: Complaint[] }>(`${BACKEND}/api/maint/all`, { withCredentials: true });
      setComplaints(res.data.data);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchComplaints();
  }, [fetchUser, fetchComplaints]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMsg("");
    try {
      if (imageFile) {
        const fd = new FormData();
        fd.append("kerboros", kerboros);
        fd.append("title", title);
        fd.append("description", description);
        fd.append("image", imageFile);
        await axios.post(`${BACKEND}/api/maint`, fd, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await axios.post(`${BACKEND}/api/maint`, { kerboros, title, description }, { withCredentials: true });
      }
      setFormMsg("Complaint submitted successfully!");
      setKerboros(""); setTitle(""); setDescription("");
      setImageFile(null); setImagePreview(null);
      setShowForm(false);
      fetchComplaints();
    } catch {
      setFormMsg("Error submitting complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await axios.put(`${BACKEND}/api/maint/resolve/${id}`, {}, { withCredentials: true });
      fetchComplaints();
    } catch {
      alert("Failed to resolve complaint.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this complaint?")) return;
    try {
      await axios.delete(`${BACKEND}/api/maint/${id}`, { withCredentials: true });
      fetchComplaints();
    } catch {
      alert("Failed to delete complaint.");
    }
  };

  return (
    <>
      <div className="page-section">
        <div className="page-blob-blue" />
        <div className="page-blob-gold" />

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h1 className="section-title">Maintenance</h1>
            <div className="section-divider" />
            <p className="section-subtitle">Report hostel maintenance issues for quick resolution</p>
          </motion.div>

          {/* <MaintCommitteeMembers /> */}

          {/* Post button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 btn-primary"
            >
              <span className="text-lg leading-none">{showForm ? "✕" : "+"}</span>
              {showForm ? "Cancel" : "Post Complaint"}
            </button>
          </div>

          {/* Success message outside form */}
          <AnimatePresence>
            {formMsg && !showForm && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-emerald-400 mb-6"
              >
                {formMsg}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submission form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="glass-card p-6 mb-8">
                  <h2 className="text-white text-xl font-semibold mb-6">New Maintenance Complaint</h2>
                  {formMsg && (
                    <p className={`mb-4 text-sm ${formMsg.includes("Error") ? "text-red-400" : "text-emerald-400"}`}>
                      {formMsg}
                    </p>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-1.5">Your Kerboros ID</label>
                      <input
                        type="text" value={kerboros} onChange={(e) => setKerboros(e.target.value)}
                        required className="input-field" placeholder="e.g. 2301cs01"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1.5">Title</label>
                      <input
                        type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                        required className="input-field" placeholder="Brief issue title"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1.5">Description</label>
                      <textarea
                        value={description} onChange={(e) => setDescription(e.target.value)}
                        required rows={4} className="input-field resize-none"
                        placeholder="Describe the issue in detail…"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1.5">Image (optional)</label>
                      <input
                        type="file" accept="image/*" onChange={handleImageChange}
                        className="w-full px-4 py-2.5 glass rounded-xl text-gray-300 text-sm cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/80 file:text-white file:text-xs file:cursor-pointer hover:file:bg-primary transition-all"
                      />
                      {imagePreview && (
                        <div className="mt-3 relative h-48 rounded-xl overflow-hidden">
                          <Image src={imagePreview} alt="Preview" fill className="object-contain" />
                          <button
                            type="button"
                            onClick={() => { setImageFile(null); setImagePreview(null); }}
                            className="absolute top-2 right-2 bg-red-600/80 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-500 transition-colors"
                          >✕</button>
                        </div>
                      )}
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                      {submitting ? "Submitting…" : "Submit Complaint"}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Complaints list */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 spinner" />
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center text-gray-500 py-16 glass-card">
              <p className="text-lg">No complaints found. All clear! ✓</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
              className="space-y-4"
            >
              {complaints.map((c) => (
                <motion.div
                  key={c.id}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  className="glass-card p-5 hover:border-white/20 transition-colors duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold text-lg">{c.title}</h3>
                        <span className={c.status === "resolved" ? "badge-resolved" : "badge-pending"}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2 leading-relaxed">{c.description}</p>
                      <p className="text-gray-500 text-xs" suppressHydrationWarning>
                        By <span className="text-primary">{c.kerboros}</span>{" "}•{" "}
                        {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>

                    {isPrivileged(user) && (
                      <div className="flex gap-2 flex-shrink-0">
                        {c.status === "pending" && (
                          <button onClick={() => handleResolve(c.id)} className="btn-success">Resolve</button>
                        )}
                        <button onClick={() => handleDelete(c.id)} className="btn-danger">Delete</button>
                      </div>
                    )}
                  </div>

                  {c.imageURL && (
                    <div className="mt-4 relative h-56 rounded-xl overflow-hidden">
                      <Image src={c.imageURL} alt="Complaint image" fill className="object-cover" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
