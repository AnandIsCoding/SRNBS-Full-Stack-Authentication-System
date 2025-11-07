import { useEffect } from "react";
import axios from "axios";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/authStore";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

axios.defaults.withCredentials = true;

function App() {
  const {
    setUser,
    setAuthenticated,
    setIsFetching,
    isAuthenticated
  } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsFetching(true);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/profile`
        );

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

    fetchProfile(); // ✅ run on app mount
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
 {/* Auth route - redirect if already authenticated */}
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />}
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

        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPassword/>} />
      </Routes>
    </>
  );
}

export default App;
