'use client';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import Footer from './components/MyFooter';

const Home = () => {
  return (
    <main className="flex flex-col">
    
      <div className="w-full mb-10">
        <Hero />
      </div>
      <div className="w-full">
        <About />
      </div>
      <div className="w-full">
        <Gallery />
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </main>
  );
};

export default Home;