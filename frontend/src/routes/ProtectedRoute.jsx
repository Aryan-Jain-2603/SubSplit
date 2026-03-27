import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../app/useAuth";
import LoadingState from "../components/ui/LoadingState";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <LoadingState
        title="Checking your session"
        description="We are confirming your current login state before loading this page."
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
