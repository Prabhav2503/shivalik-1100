"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DayType =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

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

const MEAL_CONFIG = [
  { key: "breakfast" as const, label: "Breakfast", icon: "☀️", color: "from-amber-500/20 to-amber-600/5" },
  { key: "lunch" as const, label: "Lunch", icon: "🌤️", color: "from-primary/20 to-primary/5" },
  { key: "dinner" as const, label: "Dinner", icon: "🌙", color: "from-violet-500/20 to-violet-600/5" },
];

const MessMenu = () => {
  const [activeDay, setActiveDay] = useState<DayType>("Monday");
  const [menuData, setMenuData] = useState<IMessMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessMenu();
  }, []);

  const fetchMessMenu = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/messmenu");
      if (!response.ok) throw new Error("Failed to fetch mess menu");
      const data = await response.json();
      setMenuData(data);
      const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const today = daysOfWeek[new Date().getDay()] as DayType;
      const dayExists = data.menu.some((day: IDayMenu) => day.day === today);
      setActiveDay(dayExists ? today : (data.menu[0].day as DayType));
    } catch (err) {
      setError("Failed to load mess menu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-premium flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 spinner" />
          <p className="text-gray-400">Loading mess menu…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-premium flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-sm">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="min-h-screen bg-gradient-premium flex items-center justify-center">
        <p className="text-gray-400 text-xl">No mess menu found.</p>
      </div>
    );
  }

  const activeDayMenu = menuData.menu.find((day) => day.day === activeDay);

  return (
    <div className="min-h-screen bg-gradient-premium p-4 sm:p-6 pt-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="section-title">Mess Menu</h1>
          <div className="section-divider" />
          <p className="section-subtitle">Fresh meals served daily at Shivalik</p>
        </div>

        {/* Day selector */}
        <div className="overflow-x-auto pb-4 -mx-4 sm:mx-0 mb-8">
          <div className="flex min-w-max px-4 sm:px-0 sm:justify-center gap-2">
            {menuData.menu.map((dayMenu) => {
              const isActive = activeDay === dayMenu.day;
              return (
                <button
                  key={dayMenu.day}
                  onClick={() => setActiveDay(dayMenu.day as DayType)}
                  className={`relative py-2.5 px-5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-white shadow-[0_0_16px_rgba(59,130,246,0.4)]"
                      : "text-gray-400 hover:text-white glass"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mess-day-tab"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span>{dayMenu.day.slice(0, 3)}</span>
                  <span className="hidden sm:inline">{dayMenu.day.slice(3)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu display */}
        <AnimatePresence mode="wait">
          {activeDayMenu && (
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="glass-card overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">{activeDay}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
                {MEAL_CONFIG.map(({ key, label, icon, color }) => (
                  <div key={key} className={`p-6 bg-gradient-to-b ${color}`}>
                    <h3 className="text-base font-semibold text-primary mb-4 flex items-center gap-2">
                      <span>{icon}</span> {label}
                    </h3>
                    <ul className="space-y-2">
                      {(activeDayMenu.meals[key] || []).map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-accent mt-0.5 flex-shrink-0">•</span>
                          <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessMenu;
