import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

export default function GoogleLoginComponent() {
  const navigate = useNavigate();

  // Extract setters from zustand store
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const res = await axios.post(
       `${import.meta.env.VITE_SERVER_URL}/google`,
        { token },
        { withCredentials: true }
      );

      const { data } = res;

      if (data.success) {
        // Update zustand store
        setUser(data.user);
        setAuthenticated(true);

        toast.success(data.message || "logged in successfully");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "login failed");
      }
    } catch (error) {
      console.error(
        "Error in handleGoogleSuccess in GoogleLoginComponent ---->>",
        error
      );
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="w-full flex justify-center my-4 rounded-lg">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.log("Login Failed");
          toast.error("Google login failed!");
        }}
        width="280"
      />
    </div>
  );
}
