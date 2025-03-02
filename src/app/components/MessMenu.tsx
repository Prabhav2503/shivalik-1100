'use client';

import { useState } from 'react';

// Define types for menu items
type MealType = 'Breakfast' | 'Lunch' | 'Dinner';
type DayType = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

// Interface for a single day's menu
interface DayMenu {
  Breakfast: string[];
  Lunch: string[];
  Dinner: string[];
}

// Interface for the entire week's menu
interface WeeklyMenu {
  [key: string]: DayMenu;
}

const MessMenu = () => {
  const [activeDay, setActiveDay] = useState<DayType>('Monday');

  const days: DayType[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Menu data structure with proper typing
  const menuData: WeeklyMenu = {
    Monday: {
      Breakfast: ['Idli Sambar', 'Bread Toast', 'Tea/Coffee'],
      Lunch: ['Rice', 'Dal', 'Mixed Vegetables', 'Curd'],
      Dinner: ['Chapati', 'Paneer Curry', 'Rice', 'Sweet']
    },
    Tuesday: {
      Breakfast: ['Poha', 'Boiled Eggs', 'Tea/Coffee'],
      Lunch: ['Rice', 'Rajma', 'Aloo Gobi', 'Papad'],
      Dinner: ['Chapati', 'Chicken Curry', 'Jeera Rice', 'Ice Cream']
    },
    Wednesday: {
      Breakfast: ['Dosa', 'Coconut Chutney', 'Tea/Coffee'],
      Lunch: ['Rice', 'Dal Fry', 'Bhindi', 'Raita'],
      Dinner: ['Chapati', 'Matar Paneer', 'Rice', 'Gulab Jamun']
    },
    Thursday: {
      Breakfast: ['Upma', 'Fruit Bowl', 'Tea/Coffee'],
      Lunch: ['Rice', 'Chana Dal', 'Cabbage Poriyal', 'Curd'],
      Dinner: ['Chapati', 'Egg Curry', 'Rice', 'Custard']
    },
    Friday: {
      Breakfast: ['Puri Bhaji', 'Yogurt', 'Tea/Coffee'],
      Lunch: ['Rice', 'Kadhi', 'Mixed Veg', 'Pickle'],
      Dinner: ['Chapati', 'Malai Kofta', 'Pulao', 'Rasmalai']
    },
    Saturday: {
      Breakfast: ['Pav Bhaji', 'Boiled Eggs', 'Tea/Coffee'],
      Lunch: ['Rice', 'Sambar', 'Potato Fry', 'Buttermilk'],
      Dinner: ['Chapati', 'Butter Chicken', 'Jeera Rice', 'Kheer']
    },
    Sunday: {
      Breakfast: ['Chole Bhature', 'Fruit Salad', 'Tea/Coffee'],
      Lunch: ['Veg Pulao', 'Dal Makhani', 'Paneer Tikka', 'Raita'],
      Dinner: ['Chapati', 'Mutton Curry', 'Rice', 'Gajar Halwa']
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6" style={{backgroundColor:"rgb(38,38,38)"}}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-blue-500 my-4 sm:my-6 md:my-8">Mess Menu</h1>
        
        {/* Day selector - horizontally scrollable on mobile, better spacing on larger screens */}
        <div className="overflow-x-auto pb-4 -mx-4 sm:mx-0">
          <div className="flex min-w-max px-4 sm:px-0 sm:justify-center">
            {days.map((day) => (
              <button
                style={{backgroundColor:"rgb(64,64,64)"}}
                key={day}
                onClick={() => setActiveDay(day)}
                className={`py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 mx-1 rounded-lg text-white text-sm sm:text-lg md:text-xl font-medium transition-all ${
                  activeDay === day 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {day.slice(0,3)}
                <span className="hidden sm:inline">{day.slice(3)}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Menu display - reorganized for better mobile experience */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mt-4" style={{backgroundColor:"rgb(64,64,64)"}}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
            {/* Breakfast */}
            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 sm:p-6" style={{backgroundColor:"rgb(23,23,23)"}}>
              <h3 className="text-xl sm:text-2xl font-semibold text-blue-500 mb-2 sm:mb-4">Breakfast</h3>
              <ul className="space-y-1 sm:space-y-2">
                {menuData[activeDay].Breakfast.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span className="text-gray-300 text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Lunch */}
            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 sm:p-6" style={{backgroundColor:"rgb(23,23,23)"}}>
              <h3 className="text-xl sm:text-2xl font-semibold text-blue-500 mb-2 sm:mb-4">Lunch</h3>
              <ul className="space-y-1 sm:space-y-2">
                {menuData[activeDay].Lunch.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span className="text-gray-300 text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Dinner */}
            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 sm:p-6" style={{backgroundColor:"rgb(23,23,23)"}}>
              <h3 className="text-xl sm:text-2xl font-semibold text-blue-500 mb-2 sm:mb-4">Dinner</h3>
              <ul className="space-y-1 sm:space-y-2">
                {menuData[activeDay].Lunch.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span className="text-gray-300 text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessMenu;