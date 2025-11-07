import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 5 characters long and include at least one lowercase, one uppercase, one digit, and one special character (@$!%*?&)."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Password reset successfully!");
        setTimeout(() => {
          navigate("/auth");
        }, 800);
      } else {
        toast.error(res.data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong, try again."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-500 mb-6">
          Enter your new password to reset your account.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition flex justify-center items-center ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>wait ...</>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
