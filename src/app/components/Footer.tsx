import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
// Footer Section
const Footer = () => {
    return (
      <footer className="bg-black text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Quick Links */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/team" className="hover:text-white transition-colors">Team</Link></li>
                <li><Link href="/achievements" className="hover:text-white transition-colors">Achievements</Link></li>
                <li><Link href="/complaints" className="hover:text-white transition-colors">Complaints</Link></li>
              </ul>
            </div>
  
            {/* Services */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-6">Services</h3>
              <ul className="space-y-3">
                <li><Link href="/library" className="hover:text-white transition-colors">Library Booking</Link></li>
                <li><Link href="/cr" className="hover:text-white transition-colors">CR Booking</Link></li>
                <li><Link href="/mess" className="hover:text-white transition-colors">Mess Menu</Link></li>
              </ul>
            </div>
  
            {/* Contact Us */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-6">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Mail size={18} />
                  <a href="mailto:contact@example.com" className="hover:text-white transition-colors">
                    contact@example.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={18} />
                  <a href="tel:+1234567890" className="hover:text-white transition-colors">
                    +123 456 7890
                  </a>
                </li>
              </ul>
            </div>
  
            {/* Follow Us */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-6">Follow Us</h3>
              <div className="flex gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                  className="hover:text-white transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                  className="hover:text-white transition-colors">
                  <Twitter size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="hover:text-white transition-colors">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>
  
          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p>© 2024 Student Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };

  export  default Footer