'use client';
import Image from "next/image";

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/70 to-neutral-900/80 z-10"></div>
        <img 
          src="/shiva-mess-roof.jpg" 
          alt="Shivalik Hostel" 
          className="w-full h-full object-cover object-center" 
        />
      </div>
      
      {/* Hero content */}
      <div className="container mx-auto px-4 z-20 text-center">
        <div className="mb-8 flex justify-center">
          <img 
            src="/shivalik-new-logo-removed-bg.png" 
            alt="Shivalik Logo" 
            className="w-32 h-32 md:w-40 md:h-40 animate-pulse" 
          />
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
          <span className="inline-block transform transition-transform duration-700 hover:scale-105">
            Jai Shiva
          </span>
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-300 mb-10">IIT Delhi</h2>
        <p className="text-gray-200 max-w-2xl mx-auto mb-12 text-lg">
          Welcome to Shivalik Hostel, a place of excellence and camaraderie at IIT Delhi
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/team" 
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-colors duration-300 transform hover:scale-105"
          >
            Meet the Team
          </a>
          <a 
            href="/achievements" 
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full transition-colors duration-300 transform hover:scale-105"
          >
            Our Achievements
          </a>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a 
            href="#about" 
            className="text-white opacity-75 hover:opacity-100 transition-opacity duration-300"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;