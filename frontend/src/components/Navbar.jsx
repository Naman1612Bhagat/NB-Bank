import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
              <img className="h-12 w-auto object-contain" src="/assets/logo.png" alt="NB Bank Logo" />
              <span className="font-bold text-2xl text-[var(--primary-color)] hidden sm:block tracking-tight">NB Bank</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/about" className="text-gray-700 hover:text-[var(--primary-color)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
              About
            </Link>
            
            <div className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
              <button className="flex items-center text-gray-700 hover:text-[var(--primary-color)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Create Account <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    <Link to={isAuthenticated ? "/dashboard" : "/login"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Savings Account
                    </Link>
                    <Link to={isAuthenticated ? "/dashboard" : "/login"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Current Account
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/news" className="text-gray-700 hover:text-[var(--primary-color)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
              News
            </Link>
            <Link to="/reviews" className="text-gray-700 hover:text-[var(--primary-color)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Reviews
            </Link>
            <Link to="/feedback" className="text-gray-700 hover:text-[var(--primary-color)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Feedback
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-[var(--primary-color)] font-medium">Dashboard</Link>
                <button onClick={handleLogout} className="bg-[var(--primary-color)] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[var(--secondary-color)] transition-all shadow-md hover:shadow-lg">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[var(--primary-color)] font-medium hover:text-[var(--secondary-color)] px-3 py-2 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="bg-[var(--accent-color)] text-gray-900 px-5 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-all shadow-md hover:shadow-lg">
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">About</Link>
            <Link to="/news" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">News</Link>
            <Link to="/reviews" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Reviews</Link>
            <Link to="/feedback" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Feedback</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-[var(--primary-color)] hover:bg-gray-50">Login</Link>
                <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-[var(--accent-color)] hover:bg-gray-50">Signup</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
