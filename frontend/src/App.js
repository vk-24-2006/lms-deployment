import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";


import UserDashboard from "./components/UserDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import SystemSettings from "./components/SystemSettings";

import SearchBooks from "./components/SearchBooks";
import Facilities from "./components/Facilities";
import BorrowTrack from "./components/BorrowTrack";
import Payment from "./components/Payment";

import { useAuth } from "./context/AuthContext";

function App() {

  const { user } = useAuth();

  return (
    <Router>
      <Routes>

        {/* ================= PUBLIC PAGES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<SearchBooks />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/borrow-track" element={<BorrowTrack />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/system-settings" element={<SystemSettings />} />

        

        {/* ================= LOGIN / REGISTER ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= ROLE BASED DASHBOARDS ================= */}

        {/* USER */}
        <Route
          path="/user-dashboard"
          element={
            user && user.role === "user"
              ? <UserDashboard />
              : <Navigate to="/login" />
          }
        />

        {/* EMPLOYEE */}
        <Route
          path="/employee-dashboard"
          element={
            user && user.role === "employee"
              ? <EmployeeDashboard />
              : <Navigate to="/login" />
          }
        />

        {/* OWNER */}
        <Route
          path="/owner-dashboard"
          element={
            user && user.role === "owner"
              ? <OwnerDashboard />
              : <Navigate to="/login" />
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;