"use client";
import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Footer from "../components/MyFooter";

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
  const [isError, setIsError] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (date) fetchBookedSlots(date);
  }, [date]);

  const fetchBookedSlots = async (selectedDate: string) => {
    try {
      const response = await axios.get<Booking[]>(`/api/commonroomBooking?date=${selectedDate}`);
      setBookedSlots(response.data);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setIsSubmitting(true);

    const conflict = bookedSlots.find((booking) =>
      booking.timeSlots.some((slot) => timeSlots.includes(slot)),
    );

    if (conflict) {
      setMessage("Some slots are already booked. Please select different time slots.");
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post("/api/commonroomBooking", { date, timeSlots, name, phone, purpose });
      setMessage("Booking confirmed! ✓");
      setIsError(false);
      fetchBookedSlots(date);
    } catch (error) {
      console.error("Error booking commonroom:", error);
      setMessage("Error booking common room. Please try again.");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSlotClick = (slot: string) => {
    const bookedInfo = bookedSlots.find((booking) => booking.timeSlots.includes(slot));
    if (bookedInfo) setSelectedBooking(bookedInfo);
  };

  const formatTime = (hour: number) => {
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${period} - ${displayHour + 1}:00 ${period}`;
  };

  const allTimeSlots = Array.from({ length: 24 }, (_, i) => formatTime(i));

  return (
    <>
      <div className="page-section">
        <div className="page-blob-blue" />
        <div className="page-blob-gold" />

        <div className="w-full max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <h1 className="section-title">Common Room Booking</h1>
            <div className="section-divider" />
            <p className="section-subtitle">Reserve a space for your study sessions or events</p>
          </motion.div>

          {/* Status message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-6 p-4 rounded-xl text-center text-sm font-medium border ${
                  isError
                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass-card p-8 space-y-6"
          >
            {/* Date */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Select Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Time slots grid */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Select Time Slots{" "}
                <span className="text-gray-500 font-normal">(multiple allowed — click booked slots to see details)</span>
              </label>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-3 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white/10 border border-white/15" />Available</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary/40 border border-primary/60" />Selected</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-900/60 border border-red-700/40" />Booked</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {allTimeSlots.map((slot) => {
                  const isBooked = bookedSlots.some((booking) => booking.timeSlots.includes(slot));
                  const isSelected = timeSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      className={`p-2 text-center rounded-lg min-h-[50px] text-xs font-medium transition-all duration-200 ${
                        isBooked
                          ? "bg-red-900/50 border border-red-700/40 text-red-300 cursor-pointer hover:bg-red-900/70"
                          : isSelected
                          ? "bg-primary/30 border border-primary/60 text-primary shadow-[0_0_10px_rgba(59,130,246,0.25)]"
                          : "glass text-gray-400 hover:text-white hover:border-white/25"
                      }`}
                      onClick={() =>
                        isBooked
                          ? handleSlotClick(slot)
                          : setTimeSlots((prev) =>
                              prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot],
                            )
                      }
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact name */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Person of Contact Name</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="input-field" placeholder="Your full name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
              <input
                type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="input-field" placeholder="+91 XXXXX XXXXX"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Purpose of Booking</label>
              <input
                type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)}
                className="input-field" placeholder="e.g. Study group, Club meeting…"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 spinner !border-2" />Booking…</>
              ) : "Book Common Room"}
            </motion.button>
          </motion.form>
        </div>
      </div>

      {/* Booking details modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="glass-card p-6 w-80 relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                onClick={() => setSelectedBooking(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-white mb-4">Booking Details</h3>
              <div className="space-y-2.5 text-sm">
                <p className="text-gray-400"><span className="text-gray-300 font-medium">Name:</span> {selectedBooking.name}</p>
                <p className="text-gray-400"><span className="text-gray-300 font-medium">Phone:</span> {selectedBooking.phone}</p>
                <p className="text-gray-400"><span className="text-gray-300 font-medium">Purpose:</span> {selectedBooking.purpose}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default CommonroomBooking;
