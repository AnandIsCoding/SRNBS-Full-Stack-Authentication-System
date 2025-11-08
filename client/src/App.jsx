import axios from "axios";
import { useEffect } from "react";
import { Navigate,Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Landing from "./pages/Landing";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import { useAuthStore } from "./store/authStore";

axios.defaults.withCredentials = true;

function App() {
  const {
    setUser,
    setAuthenticated,
    setIsFetching,
    isAuthenticated,
    isFetching
  } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsFetching(true);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/profile`
        ,{ withCredentials: true });

        if (res.data?.success) {
          setUser(res.data.user);
          setAuthenticated(true);
        } else {
          setUser(null);
          setAuthenticated(false);
        }
      } catch (err) {
        setUser(null);
        setAuthenticated(false);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile(); // run on app mount
  }, []);

  // Show loading while checking authentication
  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Checking authentication…
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Auth route - redirect if already authenticated */}
      <Route
        path="/auth"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />
        }
      />

      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
