'use client'

import Hero from '../components/Hero';
import ActionButtons from '../components/ActionButtons';
import Footer from '../components/Footer';


const Home = () => {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <div className="w-full mb-10">
        <Hero />
      </div>

      {/* Action Buttons Section */}
      <div className="w-full bg-white my-1000 py-20">
        <ActionButtons />
      </div>

      {/* Footer Section */}
      <div className="w-full">
        <Footer />
      </div>
    </main>
  );
};

export default Home;