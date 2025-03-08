"use client";
import { useState, FormEvent } from "react";
import axios from "axios";
import Head from "next/head";
import Footer from "../components/Footer";

export default function LibraryBooking() {
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [book, setBook] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/libBooking", {
        date,
        duration: Number(duration), // Ensure duration is stored as a number
        book,
      });

      setMessage("Library booking successful!");
      setDate("");
      setDuration("");
      setBook("");
    } catch (error) {
      console.error("Error booking library slot:", error);
      setMessage("Error booking library slot.");
    } finally {
      setLoading(false);
    }
  };

  const durationOptions = ["1", "3", "7", "14"]; // Days
  const bookOptions = ["Introduction to React", "JavaScript: The Good Parts", "Clean Code", "Design Patterns"];

  return (
    <>
      <div className="flex justify-center items-center min-h-screen w-full px-4 py-8 sm:py-12" style={{ backgroundColor: "rgb(23, 23, 23)" }}>
        <Head>
          <title>Library Booking</title>
        </Head>

        <div className="w-full max-w-lg md:max-w-2xl">
          <h1 className="text-2xl font-bold text-center text-white mb-2">Library Booking</h1>
          <p className="text-center text-gray-400 mb-6 text-sm">Reserve your study space and books</p>

          {message && <p className="text-center text-green-500">{message}</p>}

          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6">
            <div className="mb-4">
              <label htmlFor="date" className="block text-white text-sm mb-2">Select Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white text-sm border-0 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="duration" className="block text-white text-sm mb-2">Booking Duration (Days)</label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white text-sm border-0 focus:ring-2 focus:ring-purple-500"
              >
                <option value="" disabled>Select duration</option>
                {durationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} days
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="book" className="block text-white text-sm mb-2">Select Book</label>
              <select
                id="book"
                value={book}
                onChange={(e) => setBook(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white text-sm border-0 focus:ring-2 focus:ring-purple-500"
              >
                <option value="" disabled>Select a book</option>
                {bookOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 transition"
                disabled={loading}
              >
                {loading ? "Booking..." : "Book Slot"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
