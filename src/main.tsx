import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/HomePage/HomePage.tsx'
import Login from './pages/Login/Login.tsx'
import Signup from './pages/Signup/Signup.tsx'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthRoute from './AuthRoute.tsx'
import SleepDetails from './pages/SleepDetails/SleepDetails.tsx'

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB1-cdjBT_-TEjTLOyEgADlVrJusYG2iJc",
  authDomain: "provareact-af112.firebaseapp.com",
  projectId: "provareact-af112",
  storageBucket: "provareact-af112.firebasestorage.app",
  messagingSenderId: "706374179242",
  appId: "1:706374179242:web:f3fb942105f13471e373d3",
  measurementId: "G-3TLLX92RH1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
      <Route path="/" element={<AuthRoute><App /></AuthRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sleepdet" element={<SleepDetails />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>
)