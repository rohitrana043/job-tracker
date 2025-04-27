// src/components/LocalStorageNotice.jsx
// A responsive component to notify users about local storage usage

import { useState } from 'react';
import { HardDrive, X, Info } from 'lucide-react';

const LocalStorageNotice = () => {
  const [dismissed, setDismissed] = useState(
    localStorage.getItem('localStorageNoticeDismissed') === 'true'
  );

  const handleDismiss = () => {
    localStorage.setItem('localStorageNoticeDismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <HardDrive className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-medium text-blue-800">
              Local Storage Information
            </p>
            <button
              type="button"
              className="ml-auto flex-shrink-0 text-blue-500 hover:text-blue-700 focus:outline-none"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-700">
            <p>
              Your data is stored only on this device and is not synced or saved
              on our servers. If you switch devices or browsers, you won't see
              the same companies or job applications.
            </p>
            <p className="mt-1 sm:mt-2">
              We recommend regularly using the Export feature to back up your
              data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LocalStorageInfoButton = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="text-blue-600 hover:text-blue-800 flex items-center text-xs sm:text-sm"
      >
        <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        Data Storage Info
      </button>

      {showInfo && (
        <div className="absolute z-10 right-0 bottom-full mb-2 w-60 sm:w-64 bg-white shadow-lg rounded-md p-3 border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-700">
            Your data is stored locally on this device only and is not synced
            across devices or browsers.
          </p>
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => setShowInfo(false)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalStorageNotice;
