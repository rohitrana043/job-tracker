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

// Parse CSV file containing job applications
export const parseJobApplicationsCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Convert strings to numbers/booleans where appropriate
      complete: (results) => {
        try {
          // Validate required fields
          if (results.data.length === 0) {
            throw new Error('No job application data found in the CSV file');
          }

          // Check for required fields
          const firstRow = results.data[0];
          if (!firstRow.companyName || !firstRow.jobTitle) {
            throw new Error(
              'CSV must contain at least companyName and jobTitle columns'
            );
          }

          // Extract job applications from CSV data
          const applications = results.data.map((row) => {
            // Convert string representation of boolean to actual boolean
            let remote = row.remote;
            if (typeof remote === 'string') {
              remote =
                remote.toLowerCase() === 'true' ||
                remote.toLowerCase() === 'yes';
            }

            // Create a job application object for each row
            return {
              companyName: row.companyName.trim(),
              application: {
                id: row.id || uuidv4(),
                title: row.jobTitle.trim(),
                jobId: row.jobId || `JOB-${Math.floor(Math.random() * 10000)}`,
                status: row.status || 'Applied',
                dateApplied:
                  row.dateApplied || new Date().toISOString().split('T')[0],
                followUpDate: row.followUpDate || '',
                skills: row.skills || '',
                salary: row.salary || '',
                location: row.location || '',
                remote: remote || false,
                description: row.description || row.notes || '',
                createdAt: row.createdAt || new Date().toISOString(),
                lastUpdated: row.lastUpdated || new Date().toISOString(),
                followedUp: row.followedUp || false,
              },
            };
          });

          resolve(applications);
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
          companyName: company.name,
          companyId: company.id,
          id: app.id,
          jobTitle: app.title,
          jobId: app.jobId,
          status: app.status,
          dateApplied: app.dateApplied,
          followUpDate: app.followUpDate || '',
          skills: app.skills || '',
          salary: app.salary || '',
          location: app.location || '',
          remote: app.remote || false,
          description: app.description || '',
          lastUpdated: app.lastUpdated || app.createdAt || '',
          followedUp: app.followedUp || false,
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
