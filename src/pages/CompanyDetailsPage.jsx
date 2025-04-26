// src/pages/CompanyDetailsPage.jsx
// Page displaying company details and job applications

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from 'lucide-react';
import {
  getCompanyById,
  updateCompany,
  deleteCompany,
  addJobApplication,
  updateJobApplication,
  deleteJobApplication,
} from '../utils/storage';
import AddJobModal from '../components/AddJobModal';
import InterviewNotes from '../components/InterviewNotes';

const JOB_STATUS_COLORS = {
  Applied: 'bg-blue-100 text-blue-800 border-blue-200',
  Interview: 'bg-purple-100 text-purple-800 border-purple-200',
  Offer: 'bg-green-100 text-green-800 border-green-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
};

const JOB_STATUS_ICONS = {
  Applied: <Clock className="h-4 w-4" />,
  Interview: <MessageSquare className="h-4 w-4" />,
  Offer: <Check className="h-4 w-4" />,
  Rejected: <X className="h-4 w-4" />,
};

const CompanyDetailsPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'notes'
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    website: '',
    notes: '',
  });
  const [activeJobId, setActiveJobId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompany();
  }, [companyId]);

  const loadCompany = () => {
    setIsLoading(true);
    setError(null);

    try {
      const companyData = getCompanyById(companyId);

      if (!companyData) {
        setError('Company not found');
        setIsLoading(false);
        return;
      }

      setCompany(companyData);
      setEditData({
        name: companyData.name || '',
        website: companyData.website || '',
        notes: companyData.notes || '',
      });

      // If there's only one job application, auto-select it for notes
      if (companyData.applications && companyData.applications.length === 1) {
        setActiveJobId(companyData.applications[0].id);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error loading company:', err);
      setError('Failed to load company data');
      setIsLoading(false);
    }
  };

  const handleDeleteCompany = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${company.name}? This action cannot be undone.`
      )
    ) {
      setIsDeleting(true);

      try {
        deleteCompany(companyId);
        navigate('/');
      } catch (err) {
        console.error('Error deleting company:', err);
        setError('Failed to delete company');
        setIsDeleting(false);
      }
    }
  };

  const handleAddJob = (newJob) => {
    try {
      const success = addJobApplication(companyId, newJob);

      if (success) {
        // Reload company data
        loadCompany();

        // Auto-select the newly added job if it's the only one
        if (!activeJobId) {
          setActiveJobId(newJob.id);
        }
      } else {
        setError('Failed to add job application');
      }
    } catch (err) {
      console.error('Error adding job application:', err);
      setError('Failed to add job application');
    }
  };

  const handleJobStatusChange = (jobId, newStatus) => {
    if (!company || !company.applications) return;

    try {
      const jobApp = company.applications.find((app) => app.id === jobId);

      if (jobApp) {
        const updatedJob = { ...jobApp, status: newStatus };
        const success = updateJobApplication(companyId, updatedJob);

        if (success) {
          // Reload company data
          loadCompany();
        } else {
          setError('Failed to update job status');
        }
      }
    } catch (err) {
      console.error('Error updating job status:', err);
      setError('Failed to update job status');
    }
  };

  const handleUpdateJob = (updatedJob) => {
    try {
      const success = updateJobApplication(companyId, updatedJob);

      if (success) {
        // Reload company data
        loadCompany();
      } else {
        setError('Failed to update job application');
      }
    } catch (err) {
      console.error('Error updating job application:', err);
      setError('Failed to update job application');
    }
  };

  const handleDeleteJob = (jobId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this job application? This action cannot be undone.'
      )
    ) {
      try {
        const success = deleteJobApplication(companyId, jobId);

        if (success) {
          // If the deleted job was the active one, clear the active job
          if (activeJobId === jobId) {
            setActiveJobId(null);
          }

          // Reload company data
          loadCompany();
        } else {
          setError('Failed to delete job application');
        }
      } catch (err) {
        console.error('Error deleting job application:', err);
        setError('Failed to delete job application');
      }
    }
  };

  const toggleJobExpand = (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (!editData.name.trim()) {
      setError('Company name is required');
      return;
    }

    try {
      const updatedCompany = {
        ...company,
        name: editData.name.trim(),
        website: editData.website.trim(),
        notes: editData.notes.trim(),
      };

      const success = updateCompany(updatedCompany);

      if (success) {
        setCompany(updatedCompany);
        setEditMode(false);
        setError(null);
      } else {
        setError('Failed to update company');
      }
    } catch (err) {
      console.error('Error updating company:', err);
      setError('Failed to update company');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getActiveJob = () => {
    if (!activeJobId || !company || !company.applications) return null;
    return company.applications.find((app) => app.id === activeJobId);
  };

  const activeJob = getActiveJob();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error === 'Company not found') {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Company Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The company you're looking for doesn't exist or has been deleted.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ArrowLeft className="mr-1 h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">
            {error || 'Something went wrong'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ArrowLeft className="mr-1 h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Navigation */}
      <div className="mb-6">
        <Link
          to="/"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-1 h-5 w-5" />
          Back to Companies
        </Link>
      </div>

      {/* Company Header */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        {editMode ? (
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name*
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Website
                </label>
                <input
                  type="url"
                  value={editData.website}
                  onChange={(e) =>
                    setEditData({ ...editData, website: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={editData.notes}
                  onChange={(e) =>
                    setEditData({ ...editData, notes: e.target.value })
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Any notes about this company..."
                ></textarea>
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-3">
                {error}
              </div>
            )}

            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setEditData({
                    name: company.name || '',
                    website: company.website || '',
                    notes: company.notes || '',
                  });
                  setError(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {company.name}
                </h1>

                {company.website && (
                  <a
                    href={
                      company.website.startsWith('http')
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 mt-1"
                  >
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Website
                  </a>
                )}

                {company.createdAt && (
                  <p className="text-sm text-gray-500 mt-2">
                    Added on {formatDate(company.createdAt)}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center px-3 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={handleDeleteCompany}
                  disabled={isDeleting}
                  className="flex items-center px-3 py-1 text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600 mr-1"></div>
                  ) : (
                    <Trash2 className="mr-1 h-4 w-4" />
                  )}
                  Delete
                </button>
              </div>
            </div>

            {company.notes && (
              <div className="mt-4 bg-gray-50 p-3 rounded-md">
                <h2 className="text-sm font-medium text-gray-700 mb-1">
                  Notes:
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {company.notes}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Tabs Navigation */}
      {company.applications && company.applications.length > 0 && (
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === 'details'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Job Applications
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === 'notes'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('notes')}
            >
              Interview Notes
            </button>
          </div>
        </div>
      )}

      {/* Job Applications Tab */}
      {activeTab === 'details' && (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Job Applications
            </h2>
            <button
              onClick={() => setShowJobModal(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="mr-1 h-5 w-5" />
              Add Job
            </button>
          </div>

          {error && error !== 'Company not found' && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-3">
              {error}
            </div>
          )}

          {!company.applications || company.applications.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">No job applications yet</p>
              <button
                onClick={() => setShowJobModal(true)}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="mr-1 h-5 w-5" />
                Add Your First Job Application
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {company.applications.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Job Header */}
                  <div
                    className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                    onClick={() => toggleJobExpand(job.id)}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <div className="flex flex-wrap items-center mt-1 text-sm text-gray-500 space-x-3">
                        <span>ID: {job.jobId}</span>
                        <span>Applied: {formatDate(job.dateApplied)}</span>
                        {job.followUpDate && (
                          <span className="text-yellow-600">
                            Follow-up: {formatDate(job.followUpDate)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex items-center space-x-1 px-2 py-1 border rounded-full text-xs ${
                          JOB_STATUS_COLORS[job.status] ||
                          'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {JOB_STATUS_ICONS[job.status]}
                        <span>{job.status}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleJobExpand(job.id);
                        }}
                      >
                        {expandedJobId === job.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Job Details */}
                  {expandedJobId === job.id && (
                    <div className="p-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          {job.skills && (
                            <div className="mb-3">
                              <h4 className="font-medium text-gray-700 mb-1">
                                Skills Highlighted:
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {job.skills.split(',').map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {skill.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {job.location && (
                            <div className="mb-3">
                              <h4 className="font-medium text-gray-700 mb-1">
                                Location:
                              </h4>
                              <p className="text-gray-600">
                                {job.location}
                                {job.remote && ' (Remote)'}
                              </p>
                            </div>
                          )}

                          {!job.location && job.remote && (
                            <div className="mb-3">
                              <h4 className="font-medium text-gray-700 mb-1">
                                Remote:
                              </h4>
                              <p className="text-gray-600">Yes</p>
                            </div>
                          )}

                          {job.salary && (
                            <div className="mb-3">
                              <h4 className="font-medium text-gray-700 mb-1">
                                Salary Range:
                              </h4>
                              <p className="text-gray-600">{job.salary}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          {job.description && (
                            <div className="mb-3">
                              <h4 className="font-medium text-gray-700 mb-1">
                                Description:
                              </h4>
                              <p className="text-gray-600 whitespace-pre-line">
                                {job.description}
                              </p>
                            </div>
                          )}

                          {!job.description && (
                            <p className="text-gray-500 italic mb-3">
                              No description provided
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        <div className="flex space-x-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status:
                            </label>
                            <select
                              value={job.status}
                              onChange={(e) =>
                                handleJobStatusChange(job.id, e.target.value)
                              }
                              className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="Applied">Applied</option>
                              <option value="Interview">Interview</option>
                              <option value="Offer">Offer</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>

                          <button
                            onClick={() => {
                              setActiveJobId(job.id);
                              setActiveTab('notes');
                            }}
                            className="flex items-center h-8 px-3 py-1 mt-6 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
                          >
                            <MessageSquare className="mr-1 h-4 w-4" />
                            Notes
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="flex items-center px-3 py-1 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interview Notes Tab */}
      {activeTab === 'notes' && (
        <div className="bg-white shadow-sm rounded-lg p-6">
          {!company.applications || company.applications.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">
                You need to add a job application first to add interview notes
              </p>
              <button
                onClick={() => {
                  setActiveTab('details');
                  setShowJobModal(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="mr-1 h-5 w-5" />
                Add Job Application
              </button>
            </div>
          ) : (
            <>
              {/* Job Selector */}
              {company.applications.length > 1 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Job Application:
                  </label>
                  <select
                    value={activeJobId || ''}
                    onChange={(e) => setActiveJobId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">-- Select a job application --</option>
                    {company.applications.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} ({job.status}) - Applied:{' '}
                        {formatDate(job.dateApplied)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {!activeJobId ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-2">
                    {company.applications.length > 1
                      ? 'Please select a job application to view or add interview notes'
                      : 'No job application selected'}
                  </p>
                </div>
              ) : (
                <InterviewNotes
                  companyId={companyId}
                  job={activeJob}
                  onUpdateJob={handleUpdateJob}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Add Job Modal */}
      {showJobModal && (
        <AddJobModal
          company={company}
          onClose={() => setShowJobModal(false)}
          onAddJob={handleAddJob}
        />
      )}
    </div>
  );
};

export default CompanyDetailsPage;
