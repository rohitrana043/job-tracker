// src/App.jsx
// Main application component with error boundary

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AddCompanyPage from './pages/AddCompanyPage';
import CompanyDetailsPage from './pages/CompanyDetailsPage';
import ImportExportPage from './pages/ImportExportPage';
import DashboardPage from './pages/DashboardPage';
import ErrorPage from './pages/ErrorPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/dashboard"
                element={
                  <ErrorBoundary>
                    <DashboardPage />
                  </ErrorBoundary>
                }
              />
              <Route path="/add-company" element={<AddCompanyPage />} />
              <Route
                path="/company/:companyId"
                element={<CompanyDetailsPage />}
              />
              <Route path="/import-export" element={<ImportExportPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
