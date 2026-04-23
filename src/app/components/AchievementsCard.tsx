"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface AchievementCardProps {
  title: string;
  description: string;
  images?: string[];
}

const AchievementCard = ({
  title,
  description,
  images = [],
}: AchievementCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasImages = images.length > 0;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col h-full glass-card overflow-hidden group hover:border-primary/40 transition-colors duration-300"
    >
      {/* Images Carousel */}
      {hasImages && (
        <div className="relative w-full aspect-video bg-black/50 overflow-hidden">
          <Image
            src={images[currentImageIndex]}
            alt={title}
            fill
            className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent pointer-events-none" />

          {images.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 glass p-1.5 rounded-full text-white hover:bg-white/20 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 glass p-1.5 rounded-full text-white hover:bg-white/20 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1.5 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "w-4 bg-white"
                        : "w-1.5 bg-white/40"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed flex-grow">{description}</p>
      </div>

      {/* Bottom glow line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

export default AchievementCard;
