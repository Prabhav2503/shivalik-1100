// pages/complaint.js or app/complaint/page.js (depending on your Next.js version)
"use client"
import { useState, FormEvent, ChangeEvent } from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';

export default function ComplaintForm() {
  const [complaintType, setComplaintType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({ complaintType, title, description, file });
    // You would typically send this data to your backend
  };

  const handleFileChange = (e: ChangeEvent<HTMLFormElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6 py-8 sm:py-10" style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Head>
          <title>Submit a Complaint</title>
          <meta name="description" content="Submit your complaint" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        <div className="w-full max-w-3xl p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1 sm:mb-2 text-black">Submit a Complaint</h1>
          <p className="text-center text-black text-sm sm:text-base mb-6 sm:mb-8">We're here to help resolve your concerns</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 sm:mb-6 text-black">
              <h2 className="text-base sm:text-lg font-medium mb-2">Complaint Type</h2>
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="complaintType"
                    value="Mess"
                    onChange={() => setComplaintType('Mess')}
                    className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600"
                  />
                  <span className="ml-2 text-sm sm:text-base">Mess</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="complaintType"
                    value="Maintenance"
                    onChange={() => setComplaintType('Maintenance')}
                    className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600"
                  />
                  <span className="ml-2 text-sm sm:text-base">Maintenance</span>
                </label>
              </div>
            </div>

            <div className="mb-4 sm:mb-6 text-black">
              <label htmlFor="title" className="block text-base sm:text-lg font-medium mb-1 sm:mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter complaint title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4 sm:mb-6 text-black">
              <label htmlFor="description" className="block text-base sm:text-lg font-medium mb-1 sm:mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Describe your complaint in detail"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md h-24 sm:h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-6 sm:mb-8 text-black">
              <label className="block text-base sm:text-lg font-medium mb-1 sm:mb-2">
                Attachments
              </label>
              <div className="border border-dashed border-gray-300 rounded-md p-4 sm:p-6 md:p-8 text-center">
                <div className="flex justify-center mb-2">
                  <svg
                    className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-center text-sm sm:text-base">
                  <button
                    type="button"
                    onClick={() => document.getElementById('fileInput').click()}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    Upload a file
                  </button>{' '}
                  <span className="hidden sm:inline">or drag and drop</span>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  <input
                    id="fileInput"
                    type="file"
                    onChange={(e) => {handleFileChange(e)}}
                    className="hidden"
                    accept=".png,.jpg,.jpeg,.gif"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white text-sm sm:text-base font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Submit Complaint
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
}