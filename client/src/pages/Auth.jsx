import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { NavLink, useNavigate } from "react-router-dom";

import GoogleLoginComponent from "../components/GoogleLoginComponent";
import { useAuthStore } from "../store/authStore";

axios.defaults.withCredentials = true; // ✅ Always send cookies

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Zustand store methods
  const { setUser, setAuthenticated } = useAuthStore();

  // Input Handler
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Google OAuth Placeholder : Todo check later
  // const handleGoogleAuth = () => {

  //   toast.success("Google Authentication coming soon!");
  // };

//  handle signup
  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error("All fields are required.");
    }

    //  Password Validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;

    if (!passwordRegex.test(formData.password)) {
      return toast.error(
        "Password must include uppercase, lowercase, number & special character."
      );
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/signup`,
        formData
      );

      if (res.data.success) {
        toast.success( res.data.message || "Verify your email.");
        navigate("/verify-otp");
      } else {
        toast.error(res.data.message || "Signup failed.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };


        // LOGIN HANDLER
  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      return toast.error("Email & Password are required.");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/login`,
        formData,
        { withCredentials: true }
      );

      const data = res.data;

      if (data.success) {
        toast.success("Logged in successfully!");

        // ✅ Save user in Zustand
        setUser(data.user);
        setAuthenticated(true);

        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-white">
      {/* LEFT SECTION */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-20 py-10">

        <h1 className="text-4xl font-bold">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>

        <p className="text-gray-500 mt-2">
          {isSignup
            ? "Join us and start your secure journey."
            : "Access your dashboard securely."}
        </p>

        <div className="mt-10 space-y-5 w-full md:w-[80%]">
            
          {/* Google Button */}
         <GoogleLoginComponent />

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          

          {/* Name Field (Signup Only) */}
          {isSignup && (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label className="text-sm font-medium text-gray-700">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 pr-12 border rounded-xl focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[48%] text-gray-500"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Forgot Password */}
          {!isSignup && (
            <NavLink to="/forgot-password" className="flex justify-end text-sm text-purple-600 cursor-pointer">
              Forgot Password?
            </NavLink>
          )}

          {/* Submit Button */}
          <button
            onClick={isSignup ? handleSignup : handleLogin}
            disabled={loading}
            className={`w-full bg-purple-600 text-white py-3 rounded-xl transition
            ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-700"}`}
          >
            {loading
              ? isSignup
                ? "Creating account..."
                : "Signing in..."
              : isSignup
              ? "Create Account"
              : "Sign In"}
          </button>

          {/* Toggle Login <-> Signup */}
          <p className="text-md text-center text-gray-600 mt-6">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignup(false)}
                  className="text-purple-600 font-semibold"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsSignup(true)}
                  className="text-purple-600 font-semibold"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* RIGHT SECTION IMAGE */}
      <div className="w-full md:w-1/2 hidden md:block p-4">
        <img
          src="https://cdn.dribbble.com/userupload/14898990/file/original-ba68e98ea10e1867e831884c3b153387.png"
          alt="Auth UI"
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>
    </div>
  );
}
