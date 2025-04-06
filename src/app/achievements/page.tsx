"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import AchievementCard from '../components/AchievementsCard';
import Footer from '../components/MyFooter';

interface Achievement {
  _id: string;
  title: string;
  description: string;
  images: string[];
  order?: number;
}

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Fetch achievements from API
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/achievements");
        setAchievements(response.data as Achievement[]);
      } catch (err) {
        console.error("Error fetching achievements:", err);
        setError("Failed to load achievements.");
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Determine how many achievements to display
  const displayedAchievements = showAll 
    ? achievements 
    : achievements.slice(0, 6); // Show first 6 by default

  return (
    <>
      <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Our Achievements</h1>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
              Celebrating our milestones and successes
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : achievements.length === 0 ? (
            <div className="text-center text-gray-400 py-10">No achievements found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement._id}
                  title={achievement.title}
                  description={achievement.description}
                  images={achievement.images}
                />
              ))}
            </div>
          )}

          {achievements.length > 6 && (
            <div className="text-center mt-16">
              <button 
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-full hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
              >
                {showAll ? 'Show Less' : 'View All Achievements'}
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AchievementsPage;