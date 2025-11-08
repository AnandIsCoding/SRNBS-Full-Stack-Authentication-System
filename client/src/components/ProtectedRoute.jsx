import { Navigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isFetching } = useAuthStore();

  if (isFetching)
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Checking authentication…
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return children;
}
