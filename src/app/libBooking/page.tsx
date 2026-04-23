"use client";
import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Footer from "../components/MyFooter";

export default function LibraryBooking() {
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [book, setBook] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await axios.post("/api/libBooking", {
        date,
        duration: Number(duration),
        book,
      });
      console.log(response);
      setMessage("Library booking successful! 🎉");
      setDate("");
      setDuration("");
      setBook("");
    } catch (error) {
      console.error("Error booking library slot:", error);
      setMessage("Error booking library slot. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const durationOptions = ["1", "3", "7", "14"];
  const bookOptions = [
    "Introduction to React",
    "JavaScript: The Good Parts",
    "Clean Code",
    "Design Patterns",
  ];

  return (
    <>
      <div className="page-section">
        <div className="page-blob-blue" />
        <div className="page-blob-gold" />

        <div className="w-full max-w-lg mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <h1 className="section-title">Library Booking</h1>
            <div className="section-divider" />
            <p className="section-subtitle">Reserve your study space and books</p>
          </motion.div>

          {/* Status message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl text-center text-sm font-medium border ${
                isError
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
              <div>
                <label htmlFor="date" className="block text-gray-300 text-sm font-medium mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-gray-300 text-sm font-medium mb-2">
                  Booking Duration (Days)
                </label>
                <div className="relative">
                  <select
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="select-field pr-10"
                    required
                  >
                    <option value="" disabled className="bg-gray-900">Select duration</option>
                    {durationOptions.map((option) => (
                      <option key={option} value={option} className="bg-gray-900">
                        {option} day{Number(option) > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="book" className="block text-gray-300 text-sm font-medium mb-2">
                  Select Book
                </label>
                <div className="relative">
                  <select
                    id="book"
                    value={book}
                    onChange={(e) => setBook(e.target.value)}
                    className="select-field pr-10"
                    required
                  >
                    <option value="" disabled className="bg-gray-900">Select a book</option>
                    {bookOptions.map((option) => (
                      <option key={option} value={option} className="bg-gray-900">{option}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-base justify-center flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 spinner !border-2" />
                    Booking…
                  </>
                ) : "Book Library Slot"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
