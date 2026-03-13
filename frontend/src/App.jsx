import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import Layout from './components/Layout';

// Stagiaire Pages
import DashboardStagiaire from './pages/stagiaire/DashboardStagiaire';
import ReservationPage from './pages/stagiaire/ReservationPage';
import ListReservations from './pages/stagiaire/ListReservations';
import ReclamationPage from './pages/stagiaire/ReclamationPage';
import NotificationsPage from './pages/stagiaire/NotificationsPage';

// Admin Pages
import DashboardAdmin from './pages/admin/DashboardAdmin';
import AdminReservations from './pages/admin/AdminReservations';
import AdminPresence from './pages/admin/AdminPresence';
import AdminSanctions from './pages/admin/AdminSanctions';
import AdminReclamations from './pages/admin/AdminReclamations';
import AdminStats from './pages/admin/AdminStats';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLogs from './pages/admin/AdminLogs';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Espace Stagiaire */}
            <Route element={<ProtectedRoute allowedRoles={['stagiaire']} />}>
              <Route path="/stagiaire/*" element={
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<DashboardStagiaire />} />
                    <Route path="reserver" element={<ReservationPage />} />
                    <Route path="reservations" element={<ListReservations />} />
                    <Route path="reclamation" element={<ReclamationPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </Layout>
              } />
            </Route>


            {/* Espace Admin */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/*" element={
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<DashboardAdmin />} />
                    <Route path="reservations" element={<AdminReservations />} />
                    <Route path="presence" element={<AdminPresence />} />
                    <Route path="sanctions" element={<AdminSanctions />} />
                    <Route path="reclamations" element={<AdminReclamations />} />
                    <Route path="statistiques" element={<AdminStats />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="logs" element={<AdminLogs />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </Layout>
              } />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
