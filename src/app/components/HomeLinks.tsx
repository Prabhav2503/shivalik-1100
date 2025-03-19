import Link from "next/link";

const HomeLinks = () => {
    return (
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-8">
          <Link 
            href="/team" 
            className="px-8 py-4 text-xl text-white font-semibold rounded-full bg-[#a325ca] hover:bg-opacity-90 transition-all duration-300 min-w-[200px] text-center"
          >
            Meet the Team
          </Link>
          <Link 
            href="/achievements" 
            className="px-8 py-4 text-xl text-white font-semibold rounded-full bg-[#daa867] hover:bg-opacity-90 transition-all duration-300 min-w-[200px] text-center"
          >
            Our Achievements
          </Link>
        </div>
      </section>
    );
  };

  export default HomeLinks