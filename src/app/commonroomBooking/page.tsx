"use client";
import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import Footer from "../components/Footer";

interface Booking {
  date: string;
  timeSlots: string[];
  name: string;
  phone: string;
  purpose: string;
}

const CommonroomBooking = () => {
  const [date, setDate] = useState("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [bookedSlots, setBookedSlots] = useState<Booking[]>([]);
  const [message, setMessage] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (date) fetchBookedSlots(date);
  }, [date]);

  const fetchBookedSlots = async (selectedDate: string) => {
    try {
      const response = await axios.get(`/api/commonroomBooking?date=${selectedDate}`);
      setBookedSlots(response.data);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true); // Show "Booking..." state

    const conflict = bookedSlots.find((booking) =>
      booking.timeSlots.some((slot) => timeSlots.includes(slot))
    );

    if (conflict) {
      setMessage("Some slots are already booked. Please select different time slots.");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post("/api/commonroomBooking", {
        date,
        timeSlots,
        name,
        phone,
        purpose,
      });

      setMessage("Booking confirmed!");
      fetchBookedSlots(date); // Refresh booked slots
    } catch (error) {
      console.error("Error booking commonroom:", error);
      setMessage("Error booking commonroom.");
    } finally {
      setIsSubmitting(false); // Reset button state
    }
  };

  const handleSlotClick = (slot: string) => {
    const bookedInfo = bookedSlots.find((booking) => booking.timeSlots.includes(slot));
    if (bookedInfo) {
      setSelectedBooking(bookedInfo);
    }
  };

  const formatTime = (hour: number) => {
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${period} - ${displayHour + 1}:00 ${period}`;
  };

  const allTimeSlots = Array.from({ length: 24 }, (_, i) => formatTime(i));

  return (
    <>
      <div className="flex flex-col items-center min-h-screen w-full px-4 py-8 bg-gray-900">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-bold text-center text-white mb-4">Commonroom Booking</h1>
          <p className="text-center text-gray-400 mb-6 text-sm">Reserve the room for your session</p>

          {message && <p className="text-center text-red-500">{message}</p>}

          <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg">
            <div className="mb-4">
              <label className="block text-white text-sm mb-2">Select Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border-0"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm mb-2">Select Time Slots (Multiple Allowed)</label>
              <div className="grid grid-cols-6 gap-2">
                {allTimeSlots.map((slot) => {
                  const isBooked = bookedSlots.some((booking) => booking.timeSlots.includes(slot));

                  return (
                    <div
                      key={slot}
                      className={`cursor-pointer p-2 text-center rounded min-h-[50px] ${
                        isBooked ? "bg-red-600" : timeSlots.includes(slot) ? "bg-purple-600" : "bg-gray-700"
                      }`}
                      onClick={() =>
                        isBooked
                          ? handleSlotClick(slot)
                          : setTimeSlots((prev) =>
                              prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
                            )
                      }
                    >
                      <span className="text-xs font-medium">{slot}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm mb-2">Person of Contact Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border-0"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm mb-2">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border-0"
              />
            </div>

            <div className="mb-6">
              <label className="block text-white text-sm mb-2">Purpose of Booking</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border-0"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white p-2 rounded disabled:bg-gray-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Booking Commonroom..." : "Book Commonroom"}
            </button>
          </form>
        </div>
      </div>

      {/* Popup for booked slot details */}
      {selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-4 rounded-lg w-80 text-white relative">
            <button
              className="absolute top-2 right-2 text-white text-lg"
              onClick={() => setSelectedBooking(null)}
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-2">Booking Details</h3>
            <p><strong>Name:</strong> {selectedBooking.name}</p>
            <p><strong>Phone:</strong> {selectedBooking.phone}</p>
            <p><strong>Purpose:</strong> {selectedBooking.purpose}</p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default CommonroomBooking;
