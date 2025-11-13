import axios from 'axios'
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

export default function Dashboard() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { setUser, setAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Call backend to delete session/cookie
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/logout`, {
        withCredentials: true,
      });

      // Update auth store
      setUser(null);
      setAuthenticated(false);

      toast.success("Logged out successfully!");
      navigate("/"); // ✅ Now redirect works
    } catch (error) {
      console.log("Logout Error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen bg-pink-50">

      <div className="flex-1 flex flex-col">
        <main className="p-6 overflow-auto">
          <h2 className="text-2xl font-bold mb-6 text-pink-600">👋👋 Anand's Dashboard</h2>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-10">
            <div className="bg-green-200 p-6 shadow-lg rounded-xl border border-pink-300 hover:shadow-pink-200 transition">
              <h3 className="text-gray-600 text-sm">Total Users</h3>
              <p className="text-3xl font-bold mt-2 text-pink-600">1,245</p>
            </div>

            <div className="bg-blue-200 p-6 shadow-lg rounded-xl border border-pink-300 hover:shadow-pink-200 transition">
              <h3 className="text-gray-600 text-sm">Active Sessions</h3>
              <p className="text-3xl font-bold mt-2 text-pink-600">312</p>
            </div>

            <div className="bg-yellow-200 p-6 shadow-lg rounded-xl border border-pink-300 hover:shadow-pink-200 transition">
              <h3 className="text-gray-600 text-sm">New Signups</h3>
              <p className="text-3xl font-bold mt-2 text-ppink-600">57</p>
            </div>
          </div>

          {/* BOXES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-cyan-100 p-6 h-48 rounded-xl border shadow border-pink-300 hover:shadow-pink-200 transition">
              <h3 className="font-semibold text-pink-600 mb-2">Recent Activity</h3>
              <p className="text-gray-500 text-sm">Shows last login records...</p>
            </div>

            <div className="bg-orange-100 p-6 h-48 rounded-xl border shadow border-pink-300 hover:shadow-pink-200 transition">
              <h3 className="font-semibold text-pink-600 mb-2">User Analytics</h3>
              <p className="text-gray-500 text-sm">Charts and analytics come here...</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-red-100 p-6 h-48 rounded-xl border shadow border-pink-300 hover:shadow-pink-200 transition">
              <h3 className="font-semibold text-pink-600 mb-2">Recent Activity</h3>
              <p className="text-gray-500 text-sm">Shows last login records...</p>
            </div>

            <div className="p-6 bg-green-100 h-48 rounded-xl border shadow border-pink-300 hover:shadow-pink-200 transition">
              <h3 className="font-semibold text-pink-600 mb-2">User Analytics</h3>
              <p className="text-gray-500 text-sm">Charts and analytics come here...</p>
            </div>
          </div>

        </main>
      </div>

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="
    bg-pink-600 text-white px-7 py-3 rounded-md shadow-md 
    hover:bg-pink-700 transition cursor-pointer

    fixed right-5 bottom-5   /* mobile default */
    md:top-5 md:bottom-auto  /* desktop top-right */
  "
      >
        Logout
      </button>


    </div>
  );
}
