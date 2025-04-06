'use client';

import { useState, useEffect } from 'react';

// Define types for menu items
// type MealType = 'breakfast' | 'lunch' | 'dinner';
type DayType = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

// Interface for the database structure
interface IMeal {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

interface IDayMenu {
  day: string;
  meals: IMeal;
}

interface IMessMenu {
  _id?: string;
  menu: IDayMenu[];
}

const MessMenu = () => {
  const [activeDay, setActiveDay] = useState<DayType>('Monday');
  const [menuData, setMenuData] = useState<IMessMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // const days: DayType[] = [
  //   'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  // ];

  useEffect(() => {
    fetchMessMenu();
  }, []);

  const fetchMessMenu = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/messmenu");
      
      if (!response.ok) {
        throw new Error("Failed to fetch mess menu");
      }
      
      const data = await response.json();
      setMenuData(data);
      
      // Set the active day to the current day of the week or first day if not found
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = daysOfWeek[new Date().getDay()] as DayType;
      
      // Check if today exists in the menu
      const dayExists = data.menu.some((day: IDayMenu) => day.day === today);
      setActiveDay(dayExists ? today : data.menu[0].day as DayType);
      
    } catch (err) {
      setError("Failed to load mess menu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 sm:p-6 flex items-center justify-center" style={{backgroundColor:"rgb(38,38,38)"}}>
        <div className="text-white text-xl">Loading mess menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 sm:p-6 flex items-center justify-center" style={{backgroundColor:"rgb(38,38,38)"}}>
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 sm:p-6 flex items-center justify-center" style={{backgroundColor:"rgb(38,38,38)"}}>
        <div className="text-white text-xl">No mess menu found.</div>
      </div>
    );
  }

  // Find the active day's menu
  const activeDayMenu = menuData.menu.find((day) => day.day === activeDay);

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6" style={{backgroundColor:"rgb(38,38,38)"}}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-blue-500 my-4 sm:my-6 md:my-8">Mess Menu</h1>
        
        {/* Day selector - horizontally scrollable on mobile, better spacing on larger screens */}
        <div className="overflow-x-auto pb-4 -mx-4 sm:mx-0">
          <div className="flex min-w-max px-4 sm:px-0 sm:justify-center">
            {menuData.menu.map((dayMenu) => (
              <button
                style={{backgroundColor:"rgb(64,64,64)"}}
                key={dayMenu.day}
                onClick={() => setActiveDay(dayMenu.day as DayType)}
                className={`py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 mx-1 rounded-lg text-white text-sm sm:text-lg md:text-xl font-medium transition-all ${
                  activeDay === dayMenu.day 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {dayMenu.day.slice(0,3)}
                <span className="hidden sm:inline">{dayMenu.day.slice(3)}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Menu display - reorganized for better mobile experience */}
        {activeDayMenu && (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mt-4" style={{backgroundColor:"rgb(64,64,64)"}}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
              {/* Breakfast */}
              <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 sm:p-6" style={{backgroundColor:"rgb(23,23,23)"}}>
                <h3 className="text-xl sm:text-2xl font-semibold text-blue-500 mb-2 sm:mb-4">Breakfast</h3>
                <ul className="space-y-1 sm:space-y-2">
                  {activeDayMenu.meals.breakfast.map((item, index) => (
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
                  {activeDayMenu.meals.lunch.map((item, index) => (
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
                  {activeDayMenu.meals.dinner.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-gray-300 text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessMenu;