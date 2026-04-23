import Link from "next/link";

const Footer = () => {
  return (
    <footer
      id="footer"
      className="bg-[#030303] text-gray-300 pt-16 pb-8 border-t border-white/5 relative z-10 w-full overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link
              href="/"
              className="flex items-center gap-3 mb-6 inline-block group"
            >
              <div className="relative w-12 h-12 overflow-hidden rounded-full border border-white/10">
                <img
                  src="/shivalik-new-logo-removed-bg.png"
                  alt="Shivalik Hostel Logo"
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500 bg-white/5"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">
                  Shivalik Hostel
                </h3>
                <p className="text-accent text-sm font-medium">IIT Delhi</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 glass p-4 rounded-xl">
              A premier residence at the Indian Institute of Technology Delhi.
              Fostering excellence, brotherhood, and a lifelong legacy.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-4 lg:col-span-3 lg:col-start-6">
            <h3 className="text-lg font-semibold text-white mb-6 tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Library Booking", href: "/libBooking" },
                { name: "CR Booking", href: "/commonroomBooking" },
                { name: "Mess Menu", href: "/messmenu" },
                { name: "Complaints", href: "/messMaintComplain" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary mr-3 transition-colors shadow-[0_0_8px_rgba(59,130,246,0)] group-hover:shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4 lg:col-span-4">
            <h3 className="text-lg font-semibold text-white mb-6 tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-4 text-accent mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=G5XP+37G,+Shivalik+Hostel+Rd,+Indian+Institute+of+Technology+Delhi,+Hauz+Khas,+New+Delhi,+Delhi+110016"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed"
                >
                  Shivalik Hostel, IIT Delhi
                  <br />
                  Hauz Khas, New Delhi - 110016
                </a>
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-4 text-accent flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:aks@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  aks@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-4 text-accent flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+916397317761"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  +91 6397317761
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left">
            © {new Date().getFullYear()} Shivalik Hostel, IIT Delhi. All rights
            reserved.
          </p>

          <div className="flex space-x-6">
            <a
              href="https://www.instagram.com/shivalik_houseiitd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-accent transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
