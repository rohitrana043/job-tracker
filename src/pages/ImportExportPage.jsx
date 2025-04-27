// src/pages/ImportExportPage.jsx
// Responsive version of the import/export page

import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Download,
  AlertCircle,
  Check,
  FileText,
  Briefcase,
} from 'lucide-react';
import {
  parseCompaniesCSV,
  parseJobApplicationsCSV,
  exportCompaniesToCSV,
  exportJobApplicationsToCSV,
} from '../utils/csv';
import {
  getCompanies,
  saveCompanies,
  importJobApplications,
} from '../utils/storage';

const ImportExportPage = () => {
  const navigate = useNavigate();
  const companyFileInputRef = useRef(null);
  const jobsFileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('companies'); // 'companies' or 'jobs'

  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importStats, setImportStats] = useState(null);
  const [importError, setImportError] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const handleCompanyFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setImportError('Only CSV files are supported');
      return;
    }

    setIsImporting(true);
    setImportError(null);
    setImportSuccess(false);
    setImportStats(null);

    try {
      const companies = await parseCompaniesCSV(file);

      if (!companies || companies.length === 0) {
        throw new Error('No valid company data found in the CSV file');
      }

      setPreviewData({
        type: 'companies',
        data: companies,
        count: companies.length,
      });

      setIsImporting(false);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      setImportError(error.message || 'Failed to parse CSV file');
      setIsImporting(false);
    }
  };

  const handleJobsFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setImportError('Only CSV files are supported');
      return;
    }

    setIsImporting(true);
    setImportError(null);
    setImportSuccess(false);
    setImportStats(null);

    try {
      const jobApplications = await parseJobApplicationsCSV(file);

      if (!jobApplications || jobApplications.length === 0) {
        throw new Error('No valid job application data found in the CSV file');
      }

      setPreviewData({
        type: 'jobs',
        data: jobApplications,
        count: jobApplications.length,
        companies: [...new Set(jobApplications.map((job) => job.companyName))],
      });

      setIsImporting(false);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      setImportError(error.message || 'Failed to parse CSV file');
      setIsImporting(false);
    }
  };

  const handleImportCompanies = () => {
    if (!previewData || previewData.type !== 'companies' || !previewData.data) {
      setImportError('No company data to import');
      return;
    }

    try {
      const existingCompanies = getCompanies();

      // Check for duplicate names
      const existingNames = existingCompanies.map((c) => c.name.toLowerCase());
      const newCompanies = previewData.data.filter(
        (company) => !existingNames.includes(company.name.toLowerCase())
      );

      // Calculate stats
      const stats = {
        total: previewData.data.length,
        added: newCompanies.length,
        skipped: previewData.data.length - newCompanies.length,
      };

      // Save combined companies
      saveCompanies([...existingCompanies, ...newCompanies]);

      setImportSuccess(true);
      setImportStats(stats);
      setPreviewData(null);

      // Reset file input
      if (companyFileInputRef.current) {
        companyFileInputRef.current.value = '';
      }

      // Show success message and clear it after 5 seconds
      setTimeout(() => {
        setImportSuccess(false);
        setImportStats(null);
      }, 5000);
    } catch (error) {
      console.error('Error importing companies:', error);
      setImportError('Failed to import companies: ' + error.message);
    }
  };

  const handleImportJobs = () => {
    if (!previewData || previewData.type !== 'jobs' || !previewData.data) {
      setImportError('No job application data to import');
      return;
    }

    try {
      // Import job applications
      const stats = importJobApplications(previewData.data);

      setImportSuccess(true);
      setImportStats({
        total: previewData.data.length,
        added: stats.added,
        updated: stats.updated,
        failed: stats.errors.length,
        errors: stats.errors,
      });
      setPreviewData(null);

      // Reset file input
      if (jobsFileInputRef.current) {
        jobsFileInputRef.current.value = '';
      }

      // Show success message and clear it after longer time if there are errors to review
      setTimeout(
        () => {
          setImportSuccess(false);
          setImportStats(null);
        },
        stats.errors.length > 0 ? 15000 : 5000
      );
    } catch (error) {
      console.error('Error importing job applications:', error);
      setImportError('Failed to import job applications: ' + error.message);
    }
  };

  const handleExportCompanies = () => {
    try {
      const companies = getCompanies();
      exportCompaniesToCSV(companies);
    } catch (error) {
      console.error('Error exporting companies:', error);
      setImportError('Failed to export companies: ' + error.message);
    }
  };

  const handleExportApplications = () => {
    try {
      const companies = getCompanies();
      exportJobApplicationsToCSV(companies);
    } catch (error) {
      console.error('Error exporting applications:', error);
      setImportError('Failed to export job applications: ' + error.message);
    }
  };

  const handleCancelImport = () => {
    setPreviewData(null);
    setImportError(null);
    if (companyFileInputRef.current) {
      companyFileInputRef.current.value = '';
    }
    if (jobsFileInputRef.current) {
      jobsFileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <Link
          to="/"
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base"
        >
          <ArrowLeft className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          Import & Export
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
          <button
            className={`py-2 px-3 sm:px-4 font-medium text-xs sm:text-sm focus:outline-none whitespace-nowrap ${
              activeTab === 'companies'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => {
              setActiveTab('companies');
              setImportError(null);
              setPreviewData(null);
              setImportSuccess(false);
              setImportStats(null);
            }}
          >
            Companies
          </button>
          <button
            className={`py-2 px-3 sm:px-4 font-medium text-xs sm:text-sm focus:outline-none whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => {
              setActiveTab('jobs');
              setImportError(null);
              setPreviewData(null);
              setImportSuccess(false);
              setImportStats(null);
            }}
          >
            Job Applications
          </button>
        </div>

        {/* Companies Tab */}
        {activeTab === 'companies' && (
          <>
            {/* Import Section */}
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-center mb-4">
                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2" />
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Import Companies
                </h2>
              </div>

              {importSuccess && importStats && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-md p-3 flex items-start">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      Companies imported successfully!
                    </p>
                    <ul className="mt-1 text-xs sm:text-sm">
                      <li>Total: {importStats.total}</li>
                      <li>Added: {importStats.added}</li>
                      <li>Skipped (already exists): {importStats.skipped}</li>
                    </ul>
                  </div>
                </div>
              )}

              {importError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-3 flex items-start">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{importError}</span>
                </div>
              )}

              {previewData && previewData.type === 'companies' ? (
                <div className="mb-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 sm:p-4 mb-4">
                    <h3 className="font-medium text-blue-800 text-sm sm:text-base mb-2">
                      Preview Import
                    </h3>
                    <p className="text-xs sm:text-sm">
                      Found {previewData.count} companies in the CSV file.
                    </p>

                    {previewData.data.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-xs sm:text-sm font-medium text-blue-800 mb-1">
                          Sample Companies:
                        </h4>
                        <ul className="list-disc pl-5 text-blue-800 text-xs sm:text-sm">
                          {previewData.data
                            .slice(0, 5)
                            .map((company, index) => (
                              <li key={index}>{company.name}</li>
                            ))}
                          {previewData.data.length > 5 && (
                            <li className="italic">
                              ...and {previewData.data.length - 5} more
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={handleImportCompanies}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base"
                    >
                      Confirm Import
                    </button>
                    <button
                      onClick={handleCancelImport}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4 text-xs sm:text-sm">
                    Upload a CSV file with company names to import. The CSV
                    should have a header row with a column labeled "name" or
                    "company" or "companyName".
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <input
                      type="file"
                      accept=".csv"
                      ref={companyFileInputRef}
                      onChange={handleCompanyFileSelect}
                      className="hidden"
                      id="company-csv-upload"
                    />
                    <label
                      htmlFor="company-csv-upload"
                      className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer text-sm sm:text-base"
                    >
                      <Upload className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                      {isImporting ? 'Processing...' : 'Select CSV File'}
                    </label>

                    <span className="text-xs sm:text-sm text-gray-500 truncate max-w-full">
                      {companyFileInputRef.current?.files?.[0]?.name ||
                        'No file selected'}
                    </span>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h3 className="text-xs sm:text-sm font-medium text-yellow-800 mb-1">
                      CSV Format Example:
                    </h3>
                    <pre className="text-xs bg-yellow-100 p-2 rounded overflow-auto whitespace-pre-wrap">
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
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <Download className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2" />
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Export Companies
                </h2>
              </div>

              <p className="text-gray-600 mb-4 text-xs sm:text-sm">
                Export your company list as a CSV file for backup or to use in
                other applications.
              </p>

              <button
                onClick={handleExportCompanies}
                className="flex items-center w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 text-sm sm:text-base"
              >
                <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                Export Companies List
              </button>
            </div>
          </>
        )}

        {/* Job Applications Tab */}
        {activeTab === 'jobs' && (
          <>
            {/* Import Section */}
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mr-2" />
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Import Job Applications
                </h2>
              </div>

              {importSuccess && importStats && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-md p-3 flex items-start">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      Job applications imported successfully!
                    </p>
                    <ul className="mt-1 text-xs sm:text-sm">
                      <li>Total: {importStats.total}</li>
                      <li>Added: {importStats.added}</li>
                      <li>Updated: {importStats.updated}</li>
                      {importStats.failed > 0 && (
                        <li className="text-red-700">
                          Failed: {importStats.failed}
                        </li>
                      )}
                    </ul>

                    {importStats.errors && importStats.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-red-700 text-xs sm:text-sm">
                          Errors:
                        </p>
                        <ul className="list-disc pl-5 text-xs sm:text-sm text-red-700">
                          {importStats.errors
                            .slice(0, 3)
                            .map((error, index) => (
                              <li key={index} className="break-words">
                                {error}
                              </li>
                            ))}
                          {importStats.errors.length > 3 && (
                            <li className="italic">
                              ...and {importStats.errors.length - 3} more errors
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {importError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-3 flex items-start">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{importError}</span>
                </div>
              )}

              {previewData && previewData.type === 'jobs' ? (
                <div className="mb-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 sm:p-4 mb-4">
                    <h3 className="font-medium text-blue-800 text-sm sm:text-base mb-2">
                      Preview Import
                    </h3>
                    <p className="text-xs sm:text-sm">
                      Found {previewData.count} job applications in the CSV
                      file.
                    </p>

                    {previewData.companies &&
                      previewData.companies.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-xs sm:text-sm font-medium text-blue-800 mb-1">
                            Companies Referenced:
                          </h4>
                          <ul className="list-disc pl-5 text-blue-800 text-xs sm:text-sm">
                            {previewData.companies
                              .slice(0, 5)
                              .map((company, index) => (
                                <li key={index}>{company}</li>
                              ))}
                            {previewData.companies.length > 5 && (
                              <li className="italic">
                                ...and {previewData.companies.length - 5} more
                              </li>
                            )}
                          </ul>

                          <p className="mt-2 text-xs sm:text-sm text-blue-800">
                            <strong>Note:</strong> Make sure these companies
                            already exist in your tracker before importing.
                          </p>
                        </div>
                      )}

                    {previewData.data.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-xs sm:text-sm font-medium text-blue-800 mb-1">
                          Sample Applications:
                        </h4>
                        <ul className="list-disc pl-5 text-blue-800 text-xs sm:text-sm">
                          {previewData.data.slice(0, 3).map((job, index) => (
                            <li key={index}>
                              {job.application.title} at {job.companyName}
                            </li>
                          ))}
                          {previewData.data.length > 3 && (
                            <li className="italic">
                              ...and {previewData.data.length - 3} more
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={handleImportJobs}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base"
                    >
                      Confirm Import
                    </button>
                    <button
                      onClick={handleCancelImport}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4 text-xs sm:text-sm">
                    Upload a CSV file with job applications exported from this
                    tracker.
                    <strong className="text-red-600"> Important:</strong>{' '}
                    Companies must exist in your tracker before importing job
                    applications.
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <input
                      type="file"
                      accept=".csv"
                      ref={jobsFileInputRef}
                      onChange={handleJobsFileSelect}
                      className="hidden"
                      id="jobs-csv-upload"
                    />
                    <label
                      htmlFor="jobs-csv-upload"
                      className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer text-sm sm:text-base"
                    >
                      <Upload className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                      {isImporting ? 'Processing...' : 'Select CSV File'}
                    </label>

                    <span className="text-xs sm:text-sm text-gray-500 truncate max-w-full">
                      {jobsFileInputRef.current?.files?.[0]?.name ||
                        'No file selected'}
                    </span>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h3 className="text-xs sm:text-sm font-medium text-yellow-800 mb-1">
                      Required CSV Format:
                    </h3>
                    <p className="text-xs sm:text-sm text-yellow-800 mb-2">
                      The CSV must include at least these columns:
                    </p>
                    <pre className="text-xs bg-yellow-100 p-2 rounded overflow-auto whitespace-pre-wrap">
                      companyName,jobTitle,status,dateApplied
                      <br />
                      "Acme Inc","Software Developer","Applied","2025-04-20"
                      <br />
                      "XYZ Corp","DevOps Engineer","Interview","2025-04-15"
                    </pre>
                    <p className="text-xs sm:text-sm text-yellow-800 mt-2">
                      The easiest way to get the right format is to first export
                      your job applications, then modify that file and re-import
                      it.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Export Section */}
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <Download className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mr-2" />
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Export Job Applications
                </h2>
              </div>

              <p className="text-gray-600 mb-4 text-xs sm:text-sm">
                Export your job applications as a CSV file for backup, analysis,
                or to import them back later.
              </p>

              <button
                onClick={handleExportApplications}
                className="flex items-center w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 text-sm sm:text-base"
              >
                <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                Export Job Applications
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImportExportPage;
