// src/pages/AddCompanyPage.jsx
// Page for adding a new company

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { addCompany } from '../utils/storage';

const AddCompanyPage = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyNotes, setCompanyNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [companies, setCompanies] = useState([{ id: 1, name: '' }]);

  const handleCompanyNameChange = (index, value) => {
    const updatedCompanies = [...companies];
    updatedCompanies[index].name = value;
    setCompanies(updatedCompanies);

    // Clear error if exists
    if (errors[`company-${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`company-${index}`];
      setErrors(newErrors);
    }
  };

  const addCompanyField = () => {
    setCompanies([...companies, { id: companies.length + 1, name: '' }]);
  };

  const removeCompanyField = (index) => {
    if (companies.length === 1) return;

    const updatedCompanies = companies.filter((_, i) => i !== index);
    setCompanies(updatedCompanies);

    // Remove any error for this field
    if (errors[`company-${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`company-${index}`];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    companies.forEach((company, index) => {
      if (!company.name.trim()) {
        newErrors[`company-${index}`] = 'Company name is required';
        isValid = false;
      }
    });

    // Check for duplicate names
    const names = companies.map((c) => c.name.trim().toLowerCase());
    const duplicates = names.filter(
      (name, index) => name && names.indexOf(name) !== index
    );

    if (duplicates.length > 0) {
      newErrors.duplicate = 'Duplicate company names are not allowed';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create company objects and save them
      const companiesToAdd = companies
        .filter((company) => company.name.trim())
        .map((company) => ({
          id: uuidv4(),
          name: company.name.trim(),
          website: companyWebsite.trim(),
          notes: companyNotes.trim(),
          applications: [],
          createdAt: new Date().toISOString(),
        }));

      // Add each company to storage
      companiesToAdd.forEach((company) => {
        addCompany(company);
      });

      // Navigate back to home page
      navigate('/');
    } catch (error) {
      console.error('Error adding companies:', error);
      setErrors({ submit: 'Failed to add companies. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-1 h-5 w-5" />
          Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Companies</h1>

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Company Details
            </h2>

            {companies.map((company, index) => (
              <div key={company.id} className="mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name*
                    </label>
                    <input
                      type="text"
                      value={company.name}
                      onChange={(e) =>
                        handleCompanyNameChange(index, e.target.value)
                      }
                      placeholder="Enter company name"
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors[`company-${index}`]
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors[`company-${index}`] && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[`company-${index}`]}
                      </p>
                    )}
                  </div>

                  {companies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCompanyField(index)}
                      className="mt-6 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            {errors.duplicate && (
              <p className="mt-1 text-sm text-red-500 mb-3">
                {errors.duplicate}
              </p>
            )}

            <button
              type="button"
              onClick={addCompanyField}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Plus className="mr-1 h-5 w-5" />
              Add Another Company
            </button>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Additional Information (Optional)
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Website
              </label>
              <input
                type="url"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={companyNotes}
                onChange={(e) => setCompanyNotes(e.target.value)}
                placeholder="Any notes about these companies..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
              {errors.submit}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-3 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-1 h-5 w-5" />
                  Save Companies
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyPage;
