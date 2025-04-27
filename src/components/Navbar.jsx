// src/components/Navbar.jsx
// Responsive navigation bar component

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Briefcase,
  Plus,
  FileText,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if the path matches the current location
  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={closeMenu}
            >
              <Briefcase className="h-6 w-6" />
              <span className="font-bold text-xl">Job Tracker</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') ? 'bg-gray-900' : 'hover:bg-gray-700'
              }`}
            >
              <Home className="mr-1 h-5 w-5" />
              Home
            </Link>

            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/dashboard') ? 'bg-gray-900' : 'hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="mr-1 h-5 w-5" />
              Dashboard
            </Link>

            <Link
              to="/add-company"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/add-company') ? 'bg-gray-900' : 'hover:bg-gray-700'
              }`}
            >
              <Plus className="mr-1 h-5 w-5" />
              Add Company
            </Link>

            <Link
              to="/import-export"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/import-export') ? 'bg-gray-900' : 'hover:bg-gray-700'
              }`}
            >
              <FileText className="mr-1 h-5 w-5" />
              Import/Export
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
          <Link
            to="/"
            onClick={closeMenu}
            className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
              isActive('/')
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Home className="mr-2 h-5 w-5" />
            Home
          </Link>

          <Link
            to="/dashboard"
            onClick={closeMenu}
            className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
              isActive('/dashboard')
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Dashboard
          </Link>

          <Link
            to="/add-company"
            onClick={closeMenu}
            className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
              isActive('/add-company')
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Company
          </Link>

          <Link
            to="/import-export"
            onClick={closeMenu}
            className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
              isActive('/import-export')
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FileText className="mr-2 h-5 w-5" />
            Import/Export
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
