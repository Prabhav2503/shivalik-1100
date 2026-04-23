"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import AchievementCard from "../components/AchievementsCard";
import Footer from "../components/MyFooter";

interface Achievement {
  _id: string;
  title: string;
  description: string;
  images: string[];
  order?: number;
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
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
    fetchAchievements();
  }, []);

  const displayedAchievements = showAll ? achievements : achievements.slice(0, 6);

  return (
    <>
      <div className="page-section">
        <div className="page-blob-blue" />
        <div className="page-blob-gold" />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h1 className="section-title">Our Achievements</h1>
            <div className="section-divider" />
            <p className="section-subtitle">Celebrating our milestones and successes</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-14 h-14 spinner" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-10 text-lg">{error}</div>
          ) : achievements.length === 0 ? (
            <div className="text-center text-gray-400 py-10">No achievements found.</div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {displayedAchievements.map((achievement) => (
                  <motion.div key={achievement._id} variants={cardVariants}>
                    <AchievementCard
                      title={achievement.title}
                      description={achievement.description}
                      images={achievement.images}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {achievements.length > 6 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-16"
                >
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="btn-primary text-base px-8 py-3 rounded-full"
                  >
                    {showAll ? "Show Less" : "View All Achievements"}
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AchievementsPage;
