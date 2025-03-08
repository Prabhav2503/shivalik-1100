"use client";
import { useState, FormEvent } from "react";
import axios from "axios";
import Head from "next/head";
import Footer from "../components/Footer";

export default function ComplaintForm() {
  const [complaintType, setComplaintType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/complain", {
        complainType: complaintType,
        title,
        description,
      });

      setMessage("Complaint submitted successfully!");
      setComplaintType("");
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setMessage("Error submitting complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6 py-8 sm:py-10">
        <Head>
          <title>Submit a Complaint</title>
        </Head>

        <div className="w-full max-w-3xl p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-4">Submit a Complaint</h1>

          {message && <p className="text-center text-green-600">{message}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-medium mb-2">Complaint Type</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input type="radio" name="complaintType" value="Mess" onChange={() => setComplaintType("Mess")} />
                  <span className="ml-2">Mess</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="complaintType" value="Maintanence" onChange={() => setComplaintType("Maintanence")} />
                  <span className="ml-2">Maintanence</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="title" className="block font-medium mb-2">Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded p-2" required />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block font-medium mb-2">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded p-2 h-24" required></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
