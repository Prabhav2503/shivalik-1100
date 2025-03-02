"use client";

const teamMembers = [
  {
    name: "John Doe",
    role: "Team Leader",
    initials: "JD",
    email: "john.doe@example.com",
    phone: "+11234567890",
  },
  {
    name: "Jane Smith",
    role: "Coordinator",
    initials: "JS",
    email: "jane.smith@example.com",
    phone: "+19876543210",
  },
  {
    name: "Robert Miller",
    role: "Technical Lead",
    initials: "RM",
    email: "robert.miller@example.com",
    phone: "+15556789012",
  },
];

export default function TeamSection() {
  return (
    <section className="py-12 px-4 md:px-16 bg-white">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">Meet Our Team</h2>
        <p className="text-gray-500 mt-2">
          Dedicated professionals working together to serve you better
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4"
          >
            {/* Avatar with Gradient Background */}
            <div className="w-24 h-24 flex items-center justify-center rounded-full text-white text-2xl font-bold bg-gradient-to-br from-purple-500 to-pink-500">
              {member.initials}
            </div>

            {/* Name & Role */}
            <h3 className="text-xl font-semibold">{member.name}</h3>
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
    </section>
  );
}
