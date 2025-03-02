"use client"
import { useState } from 'react';
import Footer from '../components/Footer';

const ClassroomBooking = () => {
  const [room, setRoom] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [purpose, setPurpose] = useState('');
  const [students, setStudents] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ room, date, timeSlot, purpose, students });
    // Submit booking logic would go here
  };

  // Sample data for room options
  const roomOptions = ['Room 101', 'Room 102', 'Room 103', 'Computer Lab', 'Science Lab'];
  
  // Sample data for purpose options
  const purposeOptions = ['Study Group', 'Project Work', 'Presentation Practice', 'Exam Preparation', 'Club Meeting'];

  return (
    <>
    <div className="flex justify-center items-center min-h-screen w-full px-4 py-8 sm:py-12" style={{ backgroundColor: 'rgb(23, 23, 23)' }}>
      <div className="w-full max-w-lg md:max-w-2xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-2">Class Room Booking</h1>
        <p className="text-center text-gray-400 mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base">Reserve a classroom for your study sessions</p>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-4 sm:p-6 md:p-8" style={{backgroundColor:"rgb(38 38 38)"}}>
          <div className="mb-4 sm:mb-6">
            <label className="block text-white text-sm sm:text-base mb-1 sm:mb-2">
              Select Room
            </label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-800 text-white text-sm sm:text-base border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\' stroke=\'%23ffffff\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', 
                backgroundRepeat: 'no-repeat', 
                backgroundPosition: 'right 1rem center', 
                backgroundSize: '1em' 
           ,backgroundColor: "rgb(64, 64, 64)" 
              }}
            >
              <option value="" disabled selected>Choose a classroom</option>
              {roomOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="block text-white text-sm sm:text-base mb-1 sm:mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-800 text-white text-sm sm:text-base border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="dd/mm/yyyy"
              style={{ backgroundColor: "rgb(64, 64, 64)" }}
            />
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="block text-white text-sm sm:text-base mb-1 sm:mb-2">
              Select Time Slot
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <div 
                className={`flex items-center p-2 sm:p-3 rounded cursor-pointer ${timeSlot === 'morning' ? 'bg-purple-600' : 'bg-gray-800'}`}
                onClick={() => setTimeSlot('morning')}
                style={{ backgroundColor: "rgb(64, 64, 64)" }}
              >
                <div className="flex items-center justify-center w-4 sm:w-5 h-4 sm:h-5 rounded-full border border-white mr-2">
                  {timeSlot === 'morning' && <div className="w-2 sm:w-3 h-2 sm:h-3 bg-white rounded-full"></div>}
                </div>
                <span className="text-white text-sm sm:text-base">Morning (9 AM - 12 PM)</span>
              </div>
              <div 
                className={`flex items-center p-2 sm:p-3 rounded cursor-pointer ${timeSlot === 'afternoon' ? 'bg-purple-600' : 'bg-gray-800'}`}
                onClick={() => setTimeSlot('afternoon')}
                style={{ backgroundColor: "rgb(64, 64, 64)" }}
              >
                <div className="flex items-center justify-center w-4 sm:w-5 h-4 sm:h-5 rounded-full border border-white mr-2">
                  {timeSlot === 'afternoon' && <div className="w-2 sm:w-3 h-2 sm:h-3 bg-white rounded-full"></div>}
                </div>
                <span className="text-white text-sm sm:text-base">Afternoon (2 PM - 5 PM)</span>
              </div>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="block text-white text-sm sm:text-base mb-1 sm:mb-2">
              Purpose of Booking
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-800 text-white text-sm sm:text-base border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\' stroke=\'%23ffffff\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', 
                backgroundRepeat: 'no-repeat', 
                backgroundPosition: 'right 1rem center', 
                backgroundSize: '1em' ,
                backgroundColor: "rgb(64, 64, 64)" 
              }}
            >
              <option value="" disabled selected>Select purpose</option>
              {purposeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="mb-6 sm:mb-8">
            <label className="block text-white text-sm sm:text-base mb-1 sm:mb-2">
              Number of Students
            </label>
            <input
              type="number"
              value={students}
              onChange={(e) => setStudents(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-800 text-white text-sm sm:text-base border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter number of students"
              style={{ backgroundColor: "rgb(64, 64, 64)" }}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white text-sm sm:text-base font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Book Classroom
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer/>
    </>

  );
};

export default ClassroomBooking;