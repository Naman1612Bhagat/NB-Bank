import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img className="h-10 w-auto object-contain bg-white rounded-full p-1" src="/assets/logo.png" alt="NB Bank Logo" />
              <span className="font-bold text-xl text-white tracking-tight">NB Bank</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Secure, fast, and reliable banking for your everyday needs. Experience modern finance with us.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--accent-color)]">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--accent-color)]">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2"><MapPin size={16} /> 123 Finance Street, NY 10001</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +1 (800) 123-4567</li>
              <li className="flex items-center gap-2"><Mail size={16} /> support@nbbank.com</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--accent-color)]">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 font-medium hover:text-white transition-colors">Facebook</a>
              <a href="#" className="text-gray-400 font-medium hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 font-medium hover:text-white transition-colors">Instagram</a>
              <a href="#" className="text-gray-400 font-medium hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>

        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} NB Bank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
