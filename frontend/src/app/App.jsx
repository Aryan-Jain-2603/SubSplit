import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "../layouts/AppShell";
import ProtectedRoute from "../routes/ProtectedRoute";
import PlansPage from "../pages/PlansPage";
import AboutPage from "../pages/AboutPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import CreatePlanPage from "../pages/CreatePlanPage";
import EditPlanPage from "../pages/EditPlanPage";
import SubscriptionsPage from "../pages/SubscriptionsPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<PlansPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="plans" element={<PlansPage />} />
        <Route
          path="plans/new"
          element={
            <ProtectedRoute>
              <CreatePlanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="plans/:id/edit"
          element={
            <ProtectedRoute>
              <EditPlanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/subscriptions"
          element={
            <ProtectedRoute>
              <SubscriptionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="home" element={<Navigate to="/plans" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
