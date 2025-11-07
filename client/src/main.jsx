import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import toast, { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_KEY}>
      <App />
    </GoogleOAuthProvider>
    <Toaster position="top-center" reverseOrder={false} />
  </BrowserRouter>
)
