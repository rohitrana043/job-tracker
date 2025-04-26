// src/components/ErrorBoundary.jsx
// A component that catches JavaScript errors anywhere in its child component tree
// and displays a fallback UI instead of crashing the whole app

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
              Something went wrong
            </h2>

            <p className="text-gray-600 text-center mb-6">
              We're sorry, but there was an error loading this page. You can try
              refreshing the page or returning to the home page.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 bg-gray-50 rounded-md overflow-auto text-sm text-gray-800">
                <p className="font-bold mb-1">Error details:</p>
                <p>{this.state.error.toString()}</p>
              </div>
            )}

            <div className="flex flex-col space-y-3">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </button>

              <a
                href="/"
                className="px-4 py-2 text-center border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
