// src/components/AddJobModal.jsx
// Modal for adding a new job application to a company

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { X, Calendar, Bell } from 'lucide-react';

const JOB_STATUS_OPTIONS = ['Applied', 'Interview', 'Offer', 'Rejected'];

const AddJobModal = ({ company, onClose, onAddJob }) => {
  const [jobData, setJobData] = useState({
    title: '',
    jobId: '',
    description: '',
    status: 'Applied',
    dateApplied: new Date().toISOString().split('T')[0],
    followUpDate: '', // New field for follow-up reminder
    skills: '', // New field for skills highlighted
    salary: '', // New field for salary information
    location: '', // New field for job location
    remote: false, // New field for remote option
    notes: '', // Renamed from description to be more general
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJobData({
      ...jobData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!jobData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!jobData.dateApplied) {
      newErrors.dateApplied = 'Application date is required';
    }

    // If follow-up date is provided, ensure it's not before the application date
    if (
      jobData.followUpDate &&
      jobData.dateApplied &&
      jobData.followUpDate < jobData.dateApplied
    ) {
      newErrors.followUpDate =
        'Follow-up date cannot be before the application date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Auto-set follow-up date if not provided (1 week after application)
    let followUpDate = jobData.followUpDate;
    if (!followUpDate) {
      const date = new Date(jobData.dateApplied);
      date.setDate(date.getDate() + 7); // 1 week later
      followUpDate = date.toISOString().split('T')[0];
    }

    // Create the job application object
    const newJob = {
      id: uuidv4(),
      title: jobData.title,
      jobId: jobData.jobId || `JOB-${Math.floor(Math.random() * 10000)}`,
      status: jobData.status,
      dateApplied: jobData.dateApplied,
      followUpDate: followUpDate,
      skills: jobData.skills,
      salary: jobData.salary,
      location: jobData.location,
      remote: jobData.remote,
      description: jobData.notes,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      followedUp: false,
    };

    onAddJob(newJob);
    onClose();
  };

  // Calculate suggested follow-up date (1 week from application date)
  const suggestedFollowUpDate = () => {
    if (!jobData.dateApplied) return '';

    const date = new Date(jobData.dateApplied);
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Job Application for {company.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Basic Information */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={jobData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="DevOps Engineer"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job ID (optional)
                  </label>
                  <input
                    type="text"
                    name="jobId"
                    value={jobData.jobId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Leave blank to auto-generate"
                  />
                </div>
              </div>
            </div>

            {/* Dates & Status */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Dates & Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Applied*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dateApplied"
                      value={jobData.dateApplied}
                      onChange={handleChange}
                      className={`w-full pl-10 px-3 py-2 border rounded-md ${
                        errors.dateApplied
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.dateApplied && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.dateApplied}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={jobData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {JOB_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Reminder
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Bell className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="followUpDate"
                      value={jobData.followUpDate}
                      onChange={handleChange}
                      className={`w-full pl-10 px-3 py-2 border rounded-md ${
                        errors.followUpDate
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder={suggestedFollowUpDate()}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Leave blank to auto-set to 1 week after application date
                  </p>
                  {errors.followUpDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.followUpDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Job Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={jobData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="City, Province"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={jobData.salary}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. $80-100k/year"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="remote"
                      checked={jobData.remote}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Remote position
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills Highlighted
              </label>
              <input
                type="text"
                name="skills"
                value={jobData.skills}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g. Spring Boot, DevOps, AWS, CI/CD"
              />
              <p className="mt-1 text-xs text-gray-500">
                List skills you emphasized in your application
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={jobData.notes}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Job description, requirements, your thoughts..."
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
