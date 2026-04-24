"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/MyFooter";
import axios from "axios";

const BACKEND = "http://localhost:5000";

interface PortHolder {
  id: string;
  name: string;
  image: string | null;
  kerboros: string;
  designation: string[];
  room_number: string;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function TeamSection() {
  const [members, setMembers] = useState<PortHolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await axios.get<{ data: PortHolder[] }>(`${BACKEND}/api/profile/`);
        setMembers(res.data.data);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError("Failed to load team members.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase();

  const categorizeMembers = (allMembers: PortHolder[]) => {
    const admins: PortHolder[] = [];
    const secys: PortHolder[] = [];
    const reps: PortHolder[] = [];

    allMembers.forEach((member) => {
      const designations = Array.isArray(member.designation)
        ? member.designation
        : [member.designation];

      if (designations.includes("admin")) {
        admins.push(member);
      } else if (designations.includes("secy")) {
        secys.push(member);
      } else if (designations.includes("rep")) {
        reps.push(member);
      }
    });

    return { admins, secys, reps };
  };

  const renderSection = (title: string, members: PortHolder[], color: string, icon: string) => {
    if (members.length === 0) return null;

    return (
      <div key={title} className="mb-24 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-center gap-4"
        >
          <div className={`text-4xl ${color.replace('text-', 'bg-').replace('400', '500/20')} p-3 rounded-2xl border border-white/10`}>
            {icon}
          </div>
          <div>
            <h2 className={`text-4xl font-black tracking-tight ${color}`}>{title}</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary via-accent to-transparent rounded-full mt-2" />
          </div>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {members.map((member) => (
            <motion.div
              key={member.id}
              variants={cardVariants}
              whileHover={{ y: -12, scale: 1.02 }}
              className="glass-card group relative p-0 overflow-hidden border-white/5 hover:border-primary/30 transition-all duration-500 shadow-2xl hover:shadow-primary/20"
            >
              {/* Decorative background element on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors" />
              
              <div className="p-8 flex flex-col items-center">
                {/* Avatar Container */}
                <div className="relative mb-6">
                  {/* Decorative rotating border on hover */}
                  <div className="absolute -inset-2 rounded-full border-2 border-dashed border-primary/0 group-hover:border-primary/40 group-hover:rotate-180 transition-all duration-1000" />
                  
                  <div className="relative w-32 h-32 rounded-full p-1.5 bg-gradient-to-br from-white/10 to-transparent ring-1 ring-white/10 group-hover:ring-primary/40 transition-all duration-300">
                    {member.image ? (
                      <div className="relative w-full h-full rounded-full overflow-hidden shadow-inner">
                        <Image src={member.image} alt={member.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-full text-white text-3xl font-black bg-gradient-to-br from-primary to-accent shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                        {getInitials(member.name)}
                      </div>
                    )}
                  </div>

                  {/* Room Tag */}
                  <div className="absolute -bottom-2 -right-2 bg-gray-900/90 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-accent uppercase tracking-tighter">
                    Room {member.room_number}
                  </div>
                </div>

                {/* Info */}
                <div className="text-center w-full">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300 mb-1">
                    {member.name}
                  </h3>
                  <div className="text-gray-400 text-xs font-mono mb-4 tracking-widest uppercase">
                    {member.kerboros}
                  </div>

                  {/* Designation Badges */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {(Array.isArray(member.designation)
                      ? member.designation
                      : [member.designation]
                    )
                      .filter((d) => !["admin", "secy", "rep"].includes(d))
                      .map((d, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-medium text-blue-300 uppercase tracking-wide group-hover:border-primary/30 transition-colors">
                          {d}
                        </span>
                      ))}
                  </div>

                  {/* Interaction - Dummy Social Icons for aesthetic */}
                  <div className="flex justify-center gap-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  };

  const { admins, secys, reps } = categorizeMembers(members);

  return (
    <>
      <section className="page-section relative min-h-screen overflow-hidden">
        {/* Advanced Background System */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="page-blob-blue opacity-20 scale-150 animate-pulse" />
          <div className="page-blob-gold opacity-15 scale-125 bottom-0 right-0 animate-pulse delay-700" />
          {/* Noise/Mesh texture overlay could go here via a CSS class */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-24"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6"
            >
              The Guardians
            </motion.span>
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 select-none">
              Meet Our Team
            </h1>
            <div className="section-divider mb-8" />
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Meet the dedicated student council members working tirelessly to make <span className="text-white font-medium">Shivalik Hostel</span> your second home.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col justify-center items-center py-40 gap-6"
              >
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
                  <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
                  <div className="absolute inset-4 border-4 border-accent/10 rounded-full" />
                  <div className="absolute inset-4 border-4 border-b-accent rounded-full animate-spin-slow" />
                </div>
                <p className="text-gray-500 font-mono text-sm tracking-widest animate-pulse">SYNCHRONIZING REPOSITORY...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 glass p-12 rounded-3xl border-red-500/20"
              >
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-red-400 text-xl font-medium">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-8 btn-primary"
                >
                  Retry Connection
                </button>
              </motion.div>
            ) : members.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 py-32 italic text-lg"
              >
                The council chambers are currently empty. Check back soon.
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Admins Section */}
                {renderSection("Hostel Administration", admins, "text-red-400", "🏛️")}
                
                {/* Secretaries Section */}
                {renderSection("Student Secretaries", secys, "text-purple-400", "📋")}
                
                {/* Representatives Section */}
                {renderSection("Floor Representatives", reps, "text-blue-400", "👥")}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <Footer />
    </>
  );
}
