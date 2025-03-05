import React from 'react';

const AchievementCard = ({ icon, title, description, gradientColors }) => {
  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden bg-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div
        className="p-12 sm:p-16 md:p-20 flex items-center justify-center"
        style={{
          background: `linear-gradient(to right, ${gradientColors[0]}, ${gradientColors[1]})`
        }}
      >
        <div className="text-white w-12 h-12 sm:w-16 sm:h-16">
          {icon}
        </div>
      </div>
      <div className="p-6 flex-grow">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm sm:text-base">{description}</p>
      </div>
    </div>
  );
};

export default AchievementCard;