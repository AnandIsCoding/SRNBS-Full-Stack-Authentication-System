import './index.css'

import { GoogleOAuthProvider } from "@react-oauth/google";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route,Routes } from "react-router-dom";

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_KEY}>
      <App />
    </GoogleOAuthProvider>
    <Toaster position="top-center" reverseOrder={false} />
  </BrowserRouter>
)
