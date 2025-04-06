"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../../components/Footer";

interface Booking {
  _id: string;
  date: string;
  timeSlots: string[];
  name: string;
  phone: string;
  purpose: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState("");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  useEffect(() => {
    // Set current month in YYYY-MM format
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    setCurrentMonth(`${year}-${month}`);
    
    // Set today's date as default selected date
    const day = String(now.getDate()).padStart(2, "0");
    setSelectedDate(`${year}-${month}-${day}`);
    
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/bookings");
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }

    try {
      setDeleteInProgress(true);
      await axios.delete(`/api/admin/bookings?id=${id}`);
      setBookings(bookings.filter(booking => booking._id !== id));
      if (selectedBooking?._id === id) {
        setSelectedBooking(null);
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
      setError("Failed to delete booking");
    } finally {
      setConfirmDelete(null);
      setDeleteInProgress(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get all dates in the current month
  const getDaysInMonth = () => {
    if (!currentMonth) return [];
    
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    const days = [];
    
    while (date.getMonth() === month - 1) {
      const dateString = date.toISOString().split('T')[0];
      days.push(dateString);
      date.setDate(date.getDate() + 1);
    }
    
    return days;
  };

  const daysInMonth = getDaysInMonth();

  // Group bookings by date
  const bookingsByDate = bookings.reduce((acc, booking) => {
    if (!acc[booking.date]) {
      acc[booking.date] = [];
    }
    acc[booking.date].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);

  // // Get all time slots for a specific date
  // const getTimeSlotsByDate = (date: string) => {
  //   const bookingsOnDate = bookingsByDate[date] || [];
  //   const allSlots = new Set<string>();
    
  //   bookingsOnDate.forEach(booking => {
  //     booking.timeSlots.forEach(slot => {
  //       allSlots.add(slot);
  //     });
  //   });
    
  //   return Array.from(allSlots).sort();
  // };

  // Get booking for a specific slot and date
  // const getBookingBySlot = (date: string, slot: string) => {
  //   const bookingsOnDate = bookingsByDate[date] || [];
  //   return bookingsOnDate.find(booking => booking.timeSlots.includes(slot));
  // };

  // Format time slots for display
  const formatTimeSlots = (slots: string[]) => {
    return slots.join(", ");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-500 mb-6">Admin Bookings</h1>
        
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 rounded ${
                viewMode === "calendar" 
                  ? "bg-purple-600" 
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded ${
                viewMode === "list" 
                  ? "bg-purple-600" 
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              List View
            </button>
          </div>
          
          <div>
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="px-3 py-2 rounded bg-gray-700 text-white border-0"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading bookings...</div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-xl">No bookings found for this month</p>
          </div>
        ) : viewMode === "calendar" ? (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 font-semibold text-purple-400">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {/* Fill in empty spaces for the first day of the month */}
              {daysInMonth.length > 0 && 
                Array.from({ length: new Date(daysInMonth[0]).getDay() }).map((_, index) => (
                  <div key={`empty-${index}`} className="p-2 min-h-[100px]"></div>
                ))
              }
              
              {daysInMonth.map((day) => {
                const hasBookings = !!bookingsByDate[day];
                const isSelected = day === selectedDate;
                
                return (
                  <div 
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`p-2 min-h-[100px] border border-gray-700 rounded cursor-pointer transition-all ${
                      isSelected ? "bg-gray-700 border-purple-500" : 
                      hasBookings ? "bg-gray-700" : "bg-gray-800"
                    }`}
                  >
                    <div className="text-right mb-1">
                      {new Date(day).getDate()}
                    </div>
                    {hasBookings && (
                      <div className="flex flex-wrap gap-1">
                        {(bookingsByDate[day] || []).slice(0, 3).map((booking) => (
                          <div 
                            key={booking._id}
                            className="bg-purple-700 rounded-full w-3 h-3"
                            title={booking.name}
                          ></div>
                        ))}
                        {(bookingsByDate[day] || []).length > 3 && (
                          <div className="text-xs text-purple-400">
                            +{(bookingsByDate[day] || []).length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Display bookings for selected date */}
            {selectedDate && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  Bookings for {formatDate(selectedDate)}
                </h3>
                
                {(bookingsByDate[selectedDate]?.length || 0) === 0 ? (
                  <p>No bookings for this date</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(bookingsByDate[selectedDate] || []).map((booking) => (
                      <div 
                        key={booking._id}
                        className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <div className="flex justify-between mb-2">
                          <div className="font-semibold">{booking.name}</div>
                          <div className="text-sm text-purple-400">
                            {booking.timeSlots.length} time slot(s)
                          </div>
                        </div>
                        <div className="text-sm text-gray-300">
                          {formatTimeSlots(booking.timeSlots)}
                        </div>
                        <div className="text-sm text-gray-400 mt-2">
                          Purpose: {booking.purpose}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Time Slots</th>
                  <th className="py-3 px-4 text-left">Purpose</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings
                  .filter(booking => booking.date.startsWith(currentMonth))
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((booking) => (
                    <tr 
                      key={booking._id} 
                      className="border-t border-gray-700 hover:bg-gray-700 cursor-pointer"
                    >
                      <td 
                        className="py-3 px-4" 
                        onClick={() => setSelectedBooking(booking)}
                      >
                        {formatDate(booking.date)}
                      </td>
                      <td 
                        className="py-3 px-4" 
                        onClick={() => setSelectedBooking(booking)}
                      >
                        {booking.name}
                      </td>
                      <td 
                        className="py-3 px-4" 
                        onClick={() => setSelectedBooking(booking)}
                      >
                        {booking.timeSlots.length > 3 
                          ? `${booking.timeSlots.slice(0, 2).join(", ")}... +${booking.timeSlots.length - 2} more`
                          : booking.timeSlots.join(", ")
                        }
                      </td>
                      <td 
                        className="py-3 px-4" 
                        onClick={() => setSelectedBooking(booking)}
                      >
                        {booking.purpose.length > 30
                          ? `${booking.purpose.substring(0, 30)}...`
                          : booking.purpose}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBooking(booking._id);
                          }}
                          className={`text-sm px-3 py-1 rounded ${
                            confirmDelete === booking._id
                              ? "bg-red-700 hover:bg-red-800"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                          disabled={deleteInProgress}
                        >
                          {confirmDelete === booking._id ? "Confirm" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking details popup */}
      {selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white relative">
            <button
              className="absolute top-4 right-4 text-white text-lg"
              onClick={() => setSelectedBooking(null)}
            >
              ✕
            </button>
            
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Booking Details</h3>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400">Date</div>
                <div>{formatDate(selectedBooking.date)}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Contact Person</div>
                <div>{selectedBooking.name}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Phone</div>
                <div>{selectedBooking.phone}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Time Slots</div>
                <div>{selectedBooking.timeSlots.join(", ")}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Purpose</div>
                <div>{selectedBooking.purpose}</div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleDeleteBooking(selectedBooking._id)}
                className={`text-sm px-4 py-2 rounded ${
                  confirmDelete === selectedBooking._id
                    ? "bg-red-700 hover:bg-red-800"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={deleteInProgress}
              >
                {confirmDelete === selectedBooking._id 
                  ? "Confirm Delete" 
                  : deleteInProgress 
                    ? "Deleting..." 
                    : "Delete Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}