// src/utils/storage.js
// Utility functions for localStorage operations

// Keys for localStorage
const STORAGE_KEYS = {
  COMPANIES: 'job-tracker-companies',
};

// Get all companies from localStorage
export const getCompanies = () => {
  const companies = localStorage.getItem(STORAGE_KEYS.COMPANIES);
  return companies ? JSON.parse(companies) : [];
};

// Save all companies to localStorage
export const saveCompanies = (companies) => {
  localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
};

// Add a new company to localStorage
export const addCompany = (company) => {
  const companies = getCompanies();
  companies.push(company);
  saveCompanies(companies);
};

// Update a company in localStorage
export const updateCompany = (updatedCompany) => {
  const companies = getCompanies();
  const index = companies.findIndex((c) => c.id === updatedCompany.id);
  if (index !== -1) {
    companies[index] = updatedCompany;
    saveCompanies(companies);
    return true;
  }
  return false;
};

// Delete a company from localStorage
export const deleteCompany = (companyId) => {
  const companies = getCompanies();
  const filteredCompanies = companies.filter((c) => c.id !== companyId);
  saveCompanies(filteredCompanies);
};

// Get a company by ID
export const getCompanyById = (companyId) => {
  const companies = getCompanies();
  return companies.find((c) => c.id === companyId) || null;
};

// Add a job application to a company
export const addJobApplication = (companyId, jobApplication) => {
  const company = getCompanyById(companyId);
  if (!company) return false;

  if (!company.applications) {
    company.applications = [];
  }

  company.applications.push(jobApplication);
  return updateCompany(company);
};

// Update a job application
export const updateJobApplication = (companyId, jobApplication) => {
  const company = getCompanyById(companyId);
  if (!company || !company.applications) return false;

  const index = company.applications.findIndex(
    (a) => a.id === jobApplication.id
  );
  if (index !== -1) {
    company.applications[index] = jobApplication;
    return updateCompany(company);
  }
  return false;
};

// Delete a job application
export const deleteJobApplication = (companyId, jobApplicationId) => {
  const company = getCompanyById(companyId);
  if (!company || !company.applications) return false;

  company.applications = company.applications.filter(
    (a) => a.id !== jobApplicationId
  );
  return updateCompany(company);
};

// Get companies with applications
export const getCompaniesWithApplications = () => {
  const companies = getCompanies();
  return companies.filter((c) => c.applications && c.applications.length > 0);
};

// Get companies without applications
export const getCompaniesWithoutApplications = () => {
  const companies = getCompanies();
  return companies.filter(
    (c) => !c.applications || c.applications.length === 0
  );
};
