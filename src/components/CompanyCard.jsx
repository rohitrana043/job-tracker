// src/components/CompanyCard.jsx
// Card component to display a company and its applications

import { Link } from 'react-router-dom';
import { ChevronRight, Briefcase } from 'lucide-react';

const CompanyCard = ({ company }) => {
  const applicationCount = company.applications?.length || 0;

  return (
    <Link
      to={`/company/${company.id}`}
      className="block border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 bg-white"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-lg text-gray-900">
              {company.name}
            </h3>
            <p className="text-sm text-gray-500">
              {applicationCount > 0
                ? `${applicationCount} application${
                    applicationCount !== 1 ? 's' : ''
                  }`
                : 'No applications yet'}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>

      {applicationCount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Recent Applications:
          </h4>
          <ul className="space-y-1">
            {company.applications.slice(0, 2).map((app) => (
              <li
                key={app.id}
                className="text-sm flex items-center justify-between"
              >
                <span className="truncate">{app.title}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    app.status === 'Applied'
                      ? 'bg-blue-100 text-blue-800'
                      : app.status === 'Interview'
                      ? 'bg-purple-100 text-purple-800'
                      : app.status === 'Offer'
                      ? 'bg-green-100 text-green-800'
                      : app.status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {app.status}
                </span>
              </li>
            ))}
            {applicationCount > 2 && (
              <li className="text-xs text-gray-500 italic">
                +{applicationCount - 2} more application
                {applicationCount - 2 !== 1 ? 's' : ''}
              </li>
            )}
          </ul>
        </div>
      )}
    </Link>
  );
};

export default CompanyCard;
