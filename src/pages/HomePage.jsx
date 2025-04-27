// src/pages/HomePage.jsx
// Home page component with improved button positioning

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Upload, Download, Search } from 'lucide-react';
import CompanyCard from '../components/CompanyCard';
import LocalStorageNotice, {
  LocalStorageInfoButton,
} from '../components/LocalStorageNotice';
import {
  getCompanies,
  getCompaniesWithApplications,
  getCompaniesWithoutApplications,
} from '../utils/storage';

const HomePage = () => {
  const [appliedCompanies, setAppliedCompanies] = useState([]);
  const [otherCompanies, setOtherCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load companies from localStorage
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    setIsLoading(true);

    // Get companies with applications
    const withApps = getCompaniesWithApplications();

    // Get companies without applications
    const withoutApps = getCompaniesWithoutApplications();

    setAppliedCompanies(withApps);
    setOtherCompanies(withoutApps);
    setIsLoading(false);
  };

  const filterCompanies = (companies) => {
    if (!searchTerm) return companies;

    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.applications?.some((app) =>
          app.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  };

  const filteredAppliedCompanies = filterCompanies(appliedCompanies);
  const filteredOtherCompanies = filterCompanies(otherCompanies);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      {/* Header Section */}
      <div className="mb-4 sm:mb-6 sm:flex sm:justify-between sm:items-center">
        {/* Left Side - Title and Count */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Job Application Tracker
          </h1>
          <div className="flex items-center flex-wrap">
            <p className="text-gray-600 mr-2 text-sm sm:text-base">
              {appliedCompanies.length > 0
                ? `${appliedCompanies.length} ${
                    appliedCompanies.length === 1 ? 'company' : 'companies'
                  } with applications`
                : 'No job applications yet'}
            </p>
            <LocalStorageInfoButton />
          </div>
        </div>

        {/* Right Side - Buttons */}
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Link
            to="/add-company"
            className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base"
          >
            <Plus className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
            Add Company
          </Link>

          <Link
            to="/import-export"
            className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 text-sm sm:text-base"
          >
            <Upload className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
            Import
          </Link>
        </div>
      </div>

      {/* Local Storage Notice */}
      <LocalStorageNotice />

      {/* Search Box */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search companies or job titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full border-gray-300 border rounded-md py-1.5 sm:py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Applied Companies Section */}
          {filteredAppliedCompanies.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">
                Companies with Applications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredAppliedCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </div>
          )}

          {/* Other Companies Section */}
          {filteredOtherCompanies.length > 0 && (
            <div>
              <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">
                Companies without Applications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredOtherCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </div>
          )}

          {/* No Companies State */}
          {filteredAppliedCompanies.length === 0 &&
            filteredOtherCompanies.length === 0 && (
              <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  No companies found
                </h3>
                {searchTerm ? (
                  <p className="text-sm sm:text-base text-gray-600">
                    Try a different search term or clear your search
                  </p>
                ) : (
                  <div>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      Get started by adding your first company
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                      <Link
                        to="/add-company"
                        className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base"
                      >
                        <Plus className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                        Add Company
                      </Link>
                      <span className="text-gray-500 hidden sm:inline">or</span>
                      <Link
                        to="/import-export"
                        className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 text-sm sm:text-base"
                      >
                        <Upload className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                        Import Companies
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default HomePage;
