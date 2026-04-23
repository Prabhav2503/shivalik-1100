"use client";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section
      id="about"
      className="py-24 bg-gradient-premium relative overflow-hidden"
    >
      {/* Background glowing blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 mix-blend-screen"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10 mix-blend-screen"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">
            About Shivalik
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            A home away from home for students at IIT Delhi. A legacy of
            excellence, community, and unforgettable memories.
          </p>
        </motion.div>

        {/* About content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left side: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl group max-w-sm mx-auto w-full glass p-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            <img
              src="/shivalik-new-logo-removed-bg.png"
              alt="Shivalik Hostel Building"
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 rounded-xl bg-gray-900/50"
            />
          </motion.div>

          {/* Right side: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold mb-6 text-white tracking-wide">
              Our <span className="text-accent">Legacy</span>
            </h3>
            <p className="text-gray-400 mb-6 font-light leading-relaxed text-lg">
              Established in 1961, Shivalik Hostel has been a cornerstone of
              student life at IIT Delhi for decades. Our hostel provides a
              nurturing environment where academic excellence meets vibrant
              community living.
            </p>
            <p className="text-gray-400 mb-8 font-light leading-relaxed text-lg">
              Named after the majestic Shivalik range, our hostel embodies{" "}
              <span className="text-white font-medium">strength</span>,{" "}
              <span className="text-white font-medium">stability</span>, and{" "}
              <span className="text-white font-medium">grandeur</span> -
              qualities we aim to instill in every resident.
            </p>

            {/* Key features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Modern Facilities",
                  icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                },
                {
                  title: "Supportive Community",
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                },
                {
                  title: "Cultural Activities",
                  icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                },
                {
                  title: "Sporting Excellence",
                  icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-start glass-card p-4 hover:border-primary/50 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d={feature.icon}
                      />
                    </svg>
                  </div>
                  <p className="ml-4 text-gray-300 font-medium">
                    {feature.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
