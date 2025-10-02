import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/dashboardlayout.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminSignup from "./admin/AdminSignup.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import LotteryPage from "./components/LotteryGrid.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";
import FindMyTicket from "./pages/FindMyTicket.jsx";
 

function App() {
  return (
    <Router>
      <Routes>
        {/* User Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* Lottery page (protected) */}
        <Route
          path="/lottery/:powerNumber"
          element={
            <ProtectedRoute>
              <LotteryPage />
            </ProtectedRoute>
          }
        />

        {/* Success page (protected) */}
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          }
        />

        {/* Find My Ticket page (protected) */}
        <Route
          path="/find-my-ticket"
          element={
            <ProtectedRoute>
              <FindMyTicket />
            </ProtectedRoute>
          }
        />

        {/* Admin pages */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback / 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
