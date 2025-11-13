import { motion } from "framer-motion";
import { ArrowRight,CheckCircle, Lock } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

export default function LandingPage() {
  const user = useAuthStore((state) => state.user);

  const isLoggedIn = Boolean(user);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full py-34 bg-white"
    >
      <div className="max-w-4xl mx-auto text-center px-6">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto w-16 h-16 flex items-center justify-center
                     bg-black text-white rounded-full shadow-lg"
        >
          {isLoggedIn ? <CheckCircle size={32} /> : <Lock size={32} />}
        </motion.div>

        {/* Heading */}
        <h2 className="text-4xl font-bold mt-6 text-black">
          {isLoggedIn ? "You Are Authenticated" : "Dashboard Access is Protected"}
        </h2>

        {/* Description */}
        <p className="text-gray-700 mt-4 leading-relaxed max-w-xl mx-auto">
          {isLoggedIn ? (
            <>
              Welcome back,{" "}
              <span className="font-semibold">{user?.name}</span>!  
              You are logged in and authorized to access your dashboard.  
              Enjoy your personalized experience.
            </>
          ) : (
            <>
              The dashboard and internal tools are restricted for security.  
              Please log in to access your personalized dashboard.
            </>
          )}
        </p>

        {/* Button Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          {isLoggedIn ? (
            <NavLink
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 
                         bg-green-600 text-white rounded-xl font-semibold 
                         hover:bg-green-700 transition-all"
            >
              Go to Dashboard <ArrowRight size={18} />
            </NavLink>
          ) : (
            <NavLink
              to="/auth"
              className="inline-flex items-center gap-2 px-6 py-3 
                         bg-black text-white rounded-xl font-semibold 
                         hover:bg-gray-900 transition-all"
            >
              Login to Continue <ArrowRight size={18} />
            </NavLink>
          )}
        </motion.div>

        {/* Small Hint */}
        {!isLoggedIn && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 text-md text-gray-500"
          >
            (Once logged in, the system will redirect you automatically.)
          </motion.p>
        )}
      </div>
    </motion.section>
  );
}
