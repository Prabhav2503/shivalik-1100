"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../../components/Footer";

interface LibraryBooking {
  _id: string;
  date: string;
  duration: number;
  book: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminLibraryPage() {
  const [bookings, setBookings] = useState<LibraryBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<LibraryBooking | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState("");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
      const response = await axios.get<LibraryBooking[]>("/api/admin/libraryBookings");
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching library bookings:", err);
      setError("Failed to load library bookings");
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
      await axios.delete(`/api/admin/library-bookings?id=${id}`);
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

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put(`/api/admin/library-bookings?id=${id}`, { status: newStatus });
      // Update the booking in our local state
      setBookings(bookings.map(booking => 
        booking._id === id ? { ...booking, status: newStatus } : booking
      ));
      
      // Update the selected booking if it's the one we're viewing
      if (selectedBooking?._id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
      setError("Failed to update booking status");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate end date
  const calculateEndDate = (startDate: string, durationDays: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + durationDays);
    return date.toISOString().split('T')[0];
  };

  // Check if a booking is overdue
  const isOverdue = (startDate: string, duration: number, status: string) => {
    if (status === "returned") return false;
    
    const endDate = new Date(calculateEndDate(startDate, duration));
    const today = new Date();
    return status === "lended" && today > endDate;
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
    const bookingDate = booking.date.split('T')[0];
    if (!acc[bookingDate]) {
      acc[bookingDate] = [];
    }
    acc[bookingDate].push(booking);
    return acc;
  }, {} as Record<string, LibraryBooking[]>);

  // Get status badge class
  const getStatusBadgeClass = (booking: LibraryBooking) => {
    if (isOverdue(booking.date, booking.duration, booking.status)) {
      return "bg-red-500";
    }
    
    switch(booking.status) {
      case "pending":
        return "bg-yellow-500";
      case "lended":
        return "bg-blue-500";
      case "returned":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Filter bookings based on status
  const filteredBookings = bookings.filter(booking => {
    // Check month filter
    const bookingMonth = booking.date.substring(0, 7); // Get YYYY-MM part
    const monthMatch = bookingMonth === currentMonth;
    
    // Check status filter
    let statusMatch = true;
    if (statusFilter !== "all") {
      if (statusFilter === "overdue") {
        statusMatch = isOverdue(booking.date, booking.duration, booking.status);
      } else {
        statusMatch = booking.status === statusFilter;
      }
    }
    
    return monthMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-purple-500 mb-6">Library Admin Dashboard</h1>
        
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
          
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded bg-gray-700 text-white border-0"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="lended">Lended</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
            
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="px-3 py-2 rounded bg-gray-700 text-white border-0"
            />
            
            <button
              onClick={fetchBookings}
              className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700"
            >
              Refresh
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading bookings...</div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-xl">No bookings found matching your criteria</p>
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
                            className={`rounded-full w-3 h-3 ${getStatusBadgeClass(booking)}`}
                            title={booking.book}
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
                          <div className="font-semibold">{booking.book}</div>
                          <div className={`text-sm px-2 py-1 rounded-full ${getStatusBadgeClass(booking)}`}>
                            {isOverdue(booking.date, booking.duration, booking.status) ? 'Overdue' : booking.status}
                          </div>
                        </div>
                        <div className="text-sm text-gray-300">
                          Duration: {booking.duration} days
                        </div>
                        <div className="text-sm text-gray-400 mt-2">
                          Return by: {formatDate(calculateEndDate(booking.date, booking.duration))}
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
                  <th className="py-3 px-4 text-left">Book</th>
                  <th className="py-3 px-4 text-left">Duration</th>
                  <th className="py-3 px-4 text-left">Return By</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((booking) => {
                    const bookingOverdue = isOverdue(booking.date, booking.duration, booking.status);
                    
                    return (
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
                          {booking.book}
                        </td>
                        <td 
                          className="py-3 px-4" 
                          onClick={() => setSelectedBooking(booking)}
                        >
                          {booking.duration} days
                        </td>
                        <td 
                          className="py-3 px-4" 
                          onClick={() => setSelectedBooking(booking)}
                        >
                          {formatDate(calculateEndDate(booking.date, booking.duration))}
                        </td>
                        <td
                          className="py-3 px-4"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(booking)}`}>
                            {bookingOverdue ? 'Overdue' : booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            {booking.status === "pending" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(booking._id, "lended");
                                }}
                                className="text-sm px-3 py-1 rounded bg-blue-600 hover:bg-blue-700"
                              >
                                Approve & Lend
                              </button>
                            )}
                            
                            {(booking.status === "lended" || bookingOverdue) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(booking._id, "returned");
                                }}
                                className="text-sm px-3 py-1 rounded bg-green-600 hover:bg-green-700"
                              >
                                Mark Returned
                              </button>
                            )}
                            
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
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                <div className="text-sm text-gray-400">Book</div>
                <div>{selectedBooking.book}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Checkout Date</div>
                <div>{formatDate(selectedBooking.date)}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Duration</div>
                <div>{selectedBooking.duration} days</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Return By</div>
                <div>{formatDate(calculateEndDate(selectedBooking.date, selectedBooking.duration))}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Status</div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(selectedBooking)}`}>
                    {isOverdue(selectedBooking.date, selectedBooking.duration, selectedBooking.status) 
                      ? 'Overdue' 
                      : selectedBooking.status}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Created At</div>
                <div>{formatDate(selectedBooking.createdAt)}</div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <div>
                {selectedBooking.status === "pending" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking._id, "lended")}
                    className="text-sm px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 mr-2"
                  >
                    Approve & Lend
                  </button>
                )}
                
                {(selectedBooking.status === "lended" || isOverdue(selectedBooking.date, selectedBooking.duration, selectedBooking.status)) && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking._id, "returned")}
                    className="text-sm px-4 py-2 rounded bg-green-600 hover:bg-green-700 mr-2"
                  >
                    Mark Returned
                  </button>
                )}
              </div>
              
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