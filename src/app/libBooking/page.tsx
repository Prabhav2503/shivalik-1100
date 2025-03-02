"use client"
import { useState, FormEvent } from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';

export default function LibraryBooking() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [book, setBook] = useState('');
  const [bookDuration, setBookDuration] = useState('');
  const [period, setPeriod] = useState('AM');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ date, time: `${time} ${period}`, duration, book, bookDuration });
  };

  // Sample data for dropdowns
  const durationOptions = ['1 hour', '2 hours', '3 hours', '4 hours'];
  const bookOptions = ['Introduction to React', 'JavaScript: The Good Parts', 'Clean Code', 'Design Patterns'];
  const bookDurationOptions = ['1 day', '3 days', '1 week', '2 weeks'];

  return (
    <>
    <div className="flex justify-center items-center min-h-screen w-full px-4 py-8 sm:py-12" style={{ backgroundColor: 'rgb(23, 23, 23)' }}>
      <Head>
        <title>Library Booking</title>
        <meta name="description" content="Book your library space and resources" />
      </Head>

      <div className="w-full max-w-lg md:max-w-2xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-2">Library Booking</h1>
        <p className="text-center text-gray-400 mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base">Reserve your study space and books</p>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-4 sm:p-6 md:p-8" style={{backgroundColor:"rgb(38 38 38)"}}>
          <div className="mb-4 sm:mb-6">
            <label htmlFor="date" className="block text-white text-sm sm:text-base mb-1 sm:mb-2">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-800 text-white text-sm sm:text-base border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ backgroundColor: "rgb(64, 64, 64)" }}
            />
          </div>

          <div className="mb-4 sm:mb-6">
            <label htmlFor="time" className="block text-white text-sm sm:text-base mb-1 sm:mb-2">
              Select Time
            </label>
            <div className="flex">
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-l bg-gray-800 text-white text-sm sm:text-base border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ backgroundColor: "rgb(64, 64, 64)" }}
              />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 rounded-r bg-gray-800 text-white text-sm sm:text-base border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ backgroundColor: "rgb(64, 64, 64)" }}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <label htmlFor="duration" className="block text-white text-sm sm:text-base mb-1 sm:mb-2">
              Duration
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-800 text-white text-sm sm:text-base border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\' stroke=\'%23ffffff\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', 
                backgroundRepeat: 'no-repeat', 
                backgroundPosition: 'right 1rem center', 
                backgroundSize: '1em',
                backgroundColor: "rgb(64, 64, 64)" 
              }}
            >
              <option value="" disabled selected>Select duration</option>
              {durationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 sm:mb-6">
            <label htmlFor="book" className="block text-white text-sm sm:text-base mb-1 sm:mb-2">
              Select Book (Optional)
            </label>
            <select
              id="book"
              value={book}
              onChange={(e) => setBook(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-800 text-white text-sm sm:text-base border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\' stroke=\'%23ffffff\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', 
                backgroundRepeat: 'no-repeat', 
                backgroundPosition: 'right 1rem center', 
                backgroundSize: '1em',
                backgroundColor: "rgb(64, 64, 64)" 
              }}
            >
              <option value="" disabled selected>Select a book</option>
              {bookOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6 sm:mb-8">
            <label htmlFor="bookDuration" className="block text-white text-sm sm:text-base mb-1 sm:mb-2">
              Book Booking Duration
            </label>
            <select
              id="bookDuration"
              value={bookDuration}
              onChange={(e) => setBookDuration(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-800 text-white text-sm sm:text-base border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\' stroke=\'%23ffffff\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', 
                backgroundRepeat: 'no-repeat', 
                backgroundPosition: 'right 1rem center', 
                backgroundSize: '1em',
                backgroundColor: "rgb(64, 64, 64)" 
              }}
            >
              <option value="" disabled selected>Select duration</option>
              {bookDurationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white text-sm sm:text-base font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Book Slot
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
}