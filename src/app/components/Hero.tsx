'use client'
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="w-full" style={{ position: "relative", height: "500px" }}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/shiva-mess-roof.jpg" // Ensure this path is correct
          alt="Background Image"
          fill
          className="object-cover opacity-50" // Background image opacity set to 50%
          priority
        />
        {/* Color Overlay for Hue */}
        <div
          className="absolute inset-0 bg-[#8409a2] opacity-30 mix-blend-multiply"
          style={{ opacity: 0.3 }} // Adjust opacity for the hue
        ></div>
      </div>

      {/* Centered Logo */}
      <div
        className="bg-white/10 rounded-full p-2 mb-4"
        style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      >
        <Image
          src="/shivalik-new-logo.jpg" // Ensure this path is correct
          alt="Shivalik Logo"
          width={100} // Logo width
          height={100} // Logo height
          className="w-20 sm:w-24 md:w-28 h-auto object-contain opacity-90" // Adjusted size and opacity
        />
      </div>

      {/* Centered Text Content */}
      <div
        className="absolute z-10 w-full text-center text-white"
        style={{ top: "60%" }} // Adjust this value to position the text below the logo
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg">
        
        </h1>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg mt-2">
        Jai Shiva 
        </h2>
        <p className="text-2xl sm:text-3xl md:text-4xl font-medium drop-shadow-lg mt-2">
          IIT Delhi
        </p>
      </div>
    </div>
  );
};

export default Hero;