// src/pages/ErrorPage.jsx
// A dedicated page for displaying 404 and other error states

import { Link, useRouteError } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          {error?.status === 404 ? 'Page Not Found' : 'An Error Occurred'}
        </h2>

        <p className="text-gray-600 text-center mb-6">
          {error?.status === 404
            ? "We can't find the page you're looking for. It might have been moved or deleted."
            : "We're sorry, but something went wrong. Please try again later."}
        </p>

        {error && (
          <div className="mb-6 p-3 bg-gray-50 rounded-md overflow-auto text-sm text-gray-800">
            <p className="font-bold mb-1">Error details:</p>
            <p>{error.statusText || error.message || 'Unknown error'}</p>
          </div>
        )}

        <div className="flex justify-center">
          <Link
            to="/"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
