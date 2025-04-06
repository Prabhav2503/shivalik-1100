"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "../components/MyFooter";
import axios from "axios";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  imageUrl?: string;
  initials?: string;
}

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch team members from API
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await axios.get<TeamMember[]>("/api/team");
        setTeamMembers(response.data);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError("Failed to load team members.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <section className="py-12 px-4 md:px-16" style={{backgroundColor:"rgb(23,23,23)"}}>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "white" }}>Meet Our Team</h2>
          <p className="text-gray-500 mt-2">
            Dedicated professionals working together to serve you better
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No team members found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member._id}
                className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4"
              >
                {/* Avatar with Image or Initials */}
                {member.imageUrl ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden" >
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center rounded-full text-white text-2xl font-bold bg-gradient-to-br from-purple-500 to-pink-500">
                    {member.initials || getInitials(member.name)}
                  </div>
                )}
                
                {/* Name & Role */}
                <h3 className="text-xl font-semibold" style={{color:"black"}}>{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
                
                {/* Contact Information (Clickable Email & Phone) */}
                <div className="text-center text-gray-600 space-y-1">
                  <a
                    href={`mailto:${member.email}`}
                    className="text-purple-600 font-medium hover:underline"
                  >
                    {member.email}
                  </a>
                  <br />
                  <a
                    href={`tel:${member.phone}`}
                    className="text-purple-600 font-medium hover:underline"
                  >
                    {member.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}