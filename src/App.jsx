// src/App.jsx
// Main application component

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AddCompanyPage from './pages/AddCompanyPage';
import CompanyDetailsPage from './pages/CompanyDetailsPage';
import ImportExportPage from './pages/ImportExportPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/add-company" element={<AddCompanyPage />} />
            <Route
              path="/company/:companyId"
              element={<CompanyDetailsPage />}
            />
            <Route path="/import-export" element={<ImportExportPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
