// src/components/Navbar.jsx
// Navigation bar component

import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Plus, FileText, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  // Check if the path matches the current location
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6" />
              <span className="font-bold text-xl">Job Tracker</span>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
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
    </nav>
  );
};

export default Navbar;
