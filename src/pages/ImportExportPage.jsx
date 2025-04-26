// src/pages/ImportExportPage.jsx
// Page for importing and exporting data

import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Download, AlertCircle, Check } from 'lucide-react';
import {
  parseCompaniesCSV,
  exportCompaniesToCSV,
  exportJobApplicationsToCSV,
} from '../utils/csv';
import { getCompanies, saveCompanies } from '../utils/storage';

const ImportExportPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setImportError('Only CSV files are supported');
      return;
    }

    setIsImporting(true);
    setImportError(null);
    setImportSuccess(false);

    try {
      const companies = await parseCompaniesCSV(file);

      if (!companies || companies.length === 0) {
        throw new Error('No valid company data found in the CSV file');
      }

      setPreviewData({
        companies,
        count: companies.length,
      });

      setIsImporting(false);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      setImportError(error.message || 'Failed to parse CSV file');
      setIsImporting(false);
    }
  };

  const handleImport = () => {
    if (!previewData || !previewData.companies) {
      setImportError('No data to import');
      return;
    }

    try {
      const existingCompanies = getCompanies();

      // Check for duplicate names
      const existingNames = existingCompanies.map((c) => c.name.toLowerCase());
      const newCompanies = previewData.companies.filter(
        (company) => !existingNames.includes(company.name.toLowerCase())
      );

      // Save combined companies
      saveCompanies([...existingCompanies, ...newCompanies]);

      setImportSuccess(true);
      setPreviewData(null);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Show success message and clear it after 3 seconds
      setTimeout(() => {
        setImportSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error importing companies:', error);
      setImportError('Failed to import companies');
    }
  };

  const handleExportCompanies = () => {
    try {
      const companies = getCompanies();
      exportCompaniesToCSV(companies);
    } catch (error) {
      console.error('Error exporting companies:', error);
    }
  };

  const handleExportApplications = () => {
    try {
      const companies = getCompanies();
      exportJobApplicationsToCSV(companies);
    } catch (error) {
      console.error('Error exporting applications:', error);
    }
  };

  const handleCancelImport = () => {
    setPreviewData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link
          to="/"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-1 h-5 w-5" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Import & Export
        </h1>

        {/* Import Section */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Import Companies
          </h2>

          {importSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-md p-3 flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Companies imported successfully!
            </div>
          )}

          {importError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-3 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {importError}
            </div>
          )}

          {previewData ? (
            <div className="mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  Preview Import
                </h3>
                <p>Found {previewData.count} companies in the CSV file.</p>

                {previewData.companies.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">
                      Sample Companies:
                    </h4>
                    <ul className="list-disc pl-5 text-blue-800">
                      {previewData.companies
                        .slice(0, 5)
                        .map((company, index) => (
                          <li key={index} className="text-sm">
                            {company.name}
                          </li>
                        ))}
                      {previewData.companies.length > 5 && (
                        <li className="text-sm italic">
                          ...and {previewData.companies.length - 5} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirm Import
                </button>
                <button
                  onClick={handleCancelImport}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">
                Upload a CSV file with company names to import. The CSV should
                have a header row with a column labeled "name" or "company" or
                "companyName".
              </p>

              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                >
                  <Upload className="mr-1 h-5 w-5" />
                  {isImporting ? 'Processing...' : 'Select CSV File'}
                </label>

                <span className="text-sm text-gray-500">
                  {fileInputRef.current?.files?.[0]?.name || 'No file selected'}
                </span>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <h3 className="text-sm font-medium text-yellow-800 mb-1">
                  CSV Format Example:
                </h3>
                <pre className="text-xs text-yellow-800 bg-yellow-100 p-2 rounded">
                  name
                  <br />
                  Acme Corporation
                  <br />
                  Globex Inc
                  <br />
                  Initech
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Export Data
          </h2>

          <p className="text-gray-600 mb-4">
            Export your job tracking data as CSV files for backup or to use in
            other applications.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleExportCompanies}
              className="flex items-center w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50"
            >
              <Download className="mr-2 h-5 w-5 text-blue-600" />
              Export Companies List
            </button>

            <button
              onClick={handleExportApplications}
              className="flex items-center w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50"
            >
              <Download className="mr-2 h-5 w-5 text-blue-600" />
              Export Job Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportPage;
