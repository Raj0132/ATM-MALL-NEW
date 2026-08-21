import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './admin/AuthContext.jsx';
import ProtectedRoute from './admin/ProtectedRoute.jsx';
import LoginPage from './admin/LoginPage.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import LeadsPage from './admin/LeadsPage.jsx';
import SubscribersPage from './admin/SubscribersPage.jsx';
import BrochureRequestsPage from './admin/BrochureRequestsPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<App />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/leads" replace />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="subscribers" element={<SubscribersPage />} />
              <Route path="brochure-requests" element={<BrochureRequestsPage />} />
            </Route>
          </Route>

          {/* Catch-all fallback to public home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
