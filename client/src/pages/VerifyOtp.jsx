import axios from "axios";
import { TimerReset } from "lucide-react";
import React, { useRef,useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
   const { setUser, setAuthenticated } = useAuthStore();
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        return;
      }

      if (index > 0) inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/verify-otp`,
        { code: finalOtp },
        { withCredentials: true }
      );
      setUser(res.data.user);
      setAuthenticated(true);
      if(res.data.success){
         navigate('/dashboard')
      }

      toast.success(res.data.message || "OTP Verified Successfully!");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Verification failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 rounded-xl  ">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 absolute top-8 left-8 ">
          <div className="w-3 h-3 bg-purple-600 rounded-full" />
          <h2 className="font-semibold text-gray-700 text-lg">
            SRNBS FOUNDATION
          </h2>
        </div>

        <h1 className="text-3xl font-bold mb-2">Verify OTP</h1>
        <p className="text-gray-500 mb-6">
          Enter the 6-digit OTP sent to your email, please check your spam folder if you don't see it in your inbox.
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-5">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 text-sm text-gray-600 mb-6">
          <TimerReset size={18} />
          <span>OTP will expire in 1 Hour</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition flex justify-center items-center ${
            loading ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            "Verify OTP"
          )}
        </button>
      </div>
    </div>
  );
}
