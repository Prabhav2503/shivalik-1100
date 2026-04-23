"use client";

import { useState, useEffect } from "react";

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

export default function AdminMessMenu() {
  const [messMenu, setMessMenu] = useState<IMessMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [editingMeal, setEditingMeal] = useState<string | null>(null);
  const [editItems, setEditItems] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  // const router = useRouter();

  useEffect(() => {
    fetchMessMenu();
  }, []);

  const fetchMessMenu = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/messmenu");

      if (!response.ok) {
        throw new Error("Failed to fetch mess menu");
      }

      const data = await response.json();
      setMessMenu(data);
    } catch (err) {
      setError("Failed to load mess menu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (day: string, mealType: string, items: string[]) => {
    setEditingDay(day);
    setEditingMeal(mealType);
    setEditItems([...items]);
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...editItems];
    newItems[index] = value;
    setEditItems(newItems);
  };

  const handleAddItem = () => {
    setEditItems([...editItems, ""]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...editItems];
    newItems.splice(index, 1);
    setEditItems(newItems);
  };

  const saveChanges = async () => {
    if (!messMenu || !editingDay || !editingMeal) return;

    try {
      setIsSaving(true);

      // Filter out empty items
      const filteredItems = editItems.filter((item) => item.trim() !== "");

      // Create a deep copy of the current menu
      const updatedMenu = JSON.parse(JSON.stringify(messMenu));

      // Find the day being edited
      const dayIndex = updatedMenu.menu.findIndex(
        (day: IDayMenu) => day.day === editingDay,
      );

      if (dayIndex === -1) return;

      // Update the specific meal
      updatedMenu.menu[dayIndex].meals[editingMeal as keyof IMeal] =
        filteredItems;

      // Send update to API
      const response = await fetch("/api/admin/messmenu", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMenu),
      });

      if (!response.ok) {
        throw new Error("Failed to update mess menu");
      }

      // Update local state
      setMessMenu(updatedMenu);

      // Reset editing state
      setEditingDay(null);
      setEditingMeal(null);
      setEditItems([]);
    } catch (err) {
      setError("Failed to save changes");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEditing = () => {
    setEditingDay(null);
    setEditingMeal(null);
    setEditItems([]);
  };

  if (loading) {
    return <div className="p-4 text-white">Loading mess menu...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!messMenu) {
    return <div className="p-4 text-white">No mess menu found.</div>;
  }

  return (
    <div
      className="min-h-screen bg-gray-900 p-4"
      style={{ backgroundColor: "rgb(38,38,38)" }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-500 my-6">
          Admin - Mess Menu Management
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {messMenu.menu.map((day) => (
            <div
              key={day.day}
              className="bg-gray-800 p-4 rounded-lg"
              style={{ backgroundColor: "rgb(64,64,64)" }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                {day.day}
              </h2>

              {/* Breakfast */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-blue-400">
                    Breakfast
                  </h3>
                  {editingDay === day.day && editingMeal === "breakfast" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={saveChanges}
                        disabled={isSaving}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        startEditing(day.day, "breakfast", day.meals.breakfast)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editingDay === day.day && editingMeal === "breakfast" ? (
                  <div className="pl-4 border-l-2 border-blue-500">
                    {editItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleItemChange(index, e.target.value)
                          }
                          className="border rounded px-2 py-1 flex-grow bg-gray-700 text-white border-gray-600"
                        />
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddItem}
                      className="text-blue-400 hover:text-blue-300 mt-2"
                    >
                      + Add Item
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc pl-8 text-gray-300">
                    {day.meals.breakfast.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Lunch */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-blue-400">Lunch</h3>
                  {editingDay === day.day && editingMeal === "lunch" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={saveChanges}
                        disabled={isSaving}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        startEditing(day.day, "lunch", day.meals.lunch)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editingDay === day.day && editingMeal === "lunch" ? (
                  <div className="pl-4 border-l-2 border-blue-500">
                    {editItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleItemChange(index, e.target.value)
                          }
                          className="border rounded px-2 py-1 flex-grow bg-gray-700 text-white border-gray-600"
                        />
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddItem}
                      className="text-blue-400 hover:text-blue-300 mt-2"
                    >
                      + Add Item
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc pl-8 text-gray-300">
                    {day.meals.lunch.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Dinner */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-blue-400">Dinner</h3>
                  {editingDay === day.day && editingMeal === "dinner" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={saveChanges}
                        disabled={isSaving}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        startEditing(day.day, "dinner", day.meals.dinner)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editingDay === day.day && editingMeal === "dinner" ? (
                  <div className="pl-4 border-l-2 border-blue-500">
                    {editItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleItemChange(index, e.target.value)
                          }
                          className="border rounded px-2 py-1 flex-grow bg-gray-700 text-white border-gray-600"
                        />
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddItem}
                      className="text-blue-400 hover:text-blue-300 mt-2"
                    >
                      + Add Item
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc pl-8 text-gray-300">
                    {day.meals.dinner.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
