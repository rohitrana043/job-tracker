// src/utils/csv.js
// Utility functions for CSV import/export

import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';

// Parse CSV file containing company names
export const parseCompaniesCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Extract companies from CSV data
          const companies = results.data.map((row) => {
            // Create a company object for each row
            // If the CSV has a 'name' column, use that; otherwise, use the first column
            const companyName =
              row.name ||
              row.companyName ||
              row.company ||
              Object.values(row)[0];

            if (!companyName) {
              throw new Error('Could not find company name in CSV');
            }

            return {
              id: uuidv4(),
              name: companyName.trim(),
              applications: [],
              createdAt: new Date().toISOString(),
            };
          });

          resolve(companies);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

// Export companies to CSV
export const exportCompaniesToCSV = (companies) => {
  // Convert companies to CSV-friendly format
  const csvData = companies.map((company) => {
    return {
      id: company.id,
      name: company.name,
      applications: company.applications ? company.applications.length : 0,
      createdAt: company.createdAt,
    };
  });

  // Convert to CSV string
  const csv = Papa.unparse(csvData);

  // Create blob and download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Create download link and click it
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `job-tracker-companies-${new Date().toISOString().split('T')[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export job applications to CSV
export const exportJobApplicationsToCSV = (companies) => {
  // Flatten job applications from all companies
  const applications = [];

  companies.forEach((company) => {
    if (company.applications && company.applications.length > 0) {
      company.applications.forEach((app) => {
        applications.push({
          companyId: company.id,
          companyName: company.name,
          jobId: app.id,
          jobTitle: app.title,
          status: app.status,
          dateApplied: app.dateApplied,
          description: app.description,
        });
      });
    }
  });

  // Convert to CSV string
  const csv = Papa.unparse(applications);

  // Create blob and download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Create download link and click it
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `job-tracker-applications-${new Date().toISOString().split('T')[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
