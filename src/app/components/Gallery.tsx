"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type GalleryImage = {
  src: string;
  alt: string;
};

const images: Record<string, GalleryImage[]> = {
  All: [{ src: "/shivalik-new-logo.jpg", alt: "Gallery image 1" }],
  Events: [{ src: "/shivalik-new-logo.jpg", alt: "Event image" }],
  Hostel: [{ src: "/shiva-mess-roof.jpg", alt: "Hostel image" }],
  Sports: [{ src: "/shivalik-new-logo.jpg", alt: "Sports image" }],
};

const categories = ["All", "Events", "Hostel", "Sports"];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const galleryImages =
    activeCategory === "All"
      ? [...images.Events, ...images.Hostel, ...images.Sports, ...images.All]
      : images[activeCategory];

  return (
    <section id="gallery" className="py-24 bg-[#050505] relative z-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent via-yellow-200 to-accent">
            Gallery
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6 rounded-full shadow-[0_0_10px_rgba(202,138,4,0.5)]"></div>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            A glimpse into life at Shivalik Hostel
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 relative ${
                activeCategory === category
                  ? "text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="gallery-tab"
                  className="absolute inset-0 bg-primary/20 border border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {galleryImages.map((image, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                key={image.src + index + activeCategory}
                className="group relative overflow-hidden rounded-2xl shadow-xl glass-card border border-white/5 aspect-square"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 bg-black/50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
