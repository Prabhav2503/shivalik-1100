// AchievementsPage.js - Main page component
import React from 'react';
import AchievementCard from '../components/AchievementsCard';
import Footer from '../components/Footer';

// Import icons from any icon library you're using
// This example uses inline SVGs but you could import from react-icons, heroicons, etc.
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.153 5.408C10.42 3.136 11.053 2 12 2c.947 0 1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182.28.213.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506-.766.582-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452-.347 0-.674.15-1.329.452l-.595.274c-2.303 1.06-3.455 1.59-4.22 1.009-.767-.581-.64-1.89-.386-4.506l.065-.677c.073-.743.109-1.115.002-1.46-.107-.344-.345-.623-.822-1.18l-.434-.507c-1.677-1.96-2.515-2.941-2.223-3.882.293-.941 1.523-1.22 3.983-1.776l.636-.144c.699-.158 1.048-.237 1.329-.45.28-.213.46-.536.82-1.182l.328-.588Z"/>
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 2.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-.5ZM12 8a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-.5A.75.75 0 0 1 11.5 8h.5ZM14 8a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-.5A.75.75 0 0 1 13.5 8h.5ZM16 8a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-.5A.75.75 0 0 1 15.5 8h.5ZM12 10a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-.5A.75.75 0 0 1 11.5 10h.5ZM14 10a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-.5a.75.75 0 0 1 .75-.75h.5ZM16 10a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-.5a.75.75 0 0 1 .75-.75h.5ZM12 12a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-.5a.75.75 0 0 1 .75-.75h.5ZM14 12a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-.5a.75.75 0 0 1 .75-.75h.5ZM16 12a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-.5a.75.75 0 0 1 .75-.75h.5ZM18 13.5v2.25a.75.75 0 0 1-.75.75H16.5v2.25a.75.75 0 0 1-.75.75h-9a.75.75 0 0 1-.75-.75V16.5H4.5a.75.75 0 0 1-.75-.75V13.5a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 .75.75Z"/>
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z"/>
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clipRule="evenodd"/>
  </svg>
);

const MedalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd"/>
  </svg>
);

const AchievementsPage = () => {
  // Sample data - in a real app, this would come from your API or database
  const achievements = [
    {
      id: 1,
      icon: <StarIcon />,
      title: "Best Campus Award",
      description: "Recognized for exceptional infrastructure and student facilities in 2023.",
      gradientColors: ["#8B5CF6", "#EC4899"]
    },
    {
      id: 2,
      icon: <BuildingIcon />,
      title: "Innovation Excellence",
      description: "Winner of the National Innovation Challenge 2023.",
      gradientColors: ["#3B82F6", "#8B5CF6"]
    },
    {
      id: 3,
      icon: <BookIcon />,
      title: "Academic Excellence",
      description: "100% placement record for three consecutive years.",
      gradientColors: ["#EC4899", "#EF4444"]
    },
    {
      id: 4,
      icon: <TrophyIcon />,
      title: "Sports Champions",
      description: "National Inter-University Sports Champions 2024.",
      gradientColors: ["#F59E0B", "#EF4444"]
    },
    {
      id: 5,
      icon: <MedalIcon />,
      title: "Research Excellence",
      description: "Published over 500 research papers in international journals.",
      gradientColors: ["#10B981", "#3B82F6"]
    }
  ];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              icon={achievement.icon}
              title={achievement.title}
              description={achievement.description}
              gradientColors={achievement.gradientColors}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-full hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all">
            View All Achievements
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default AchievementsPage;