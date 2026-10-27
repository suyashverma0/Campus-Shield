import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

import Home from "../pages/Home";
import LostItems from "../pages/LostItems";
import FoundItems from "../pages/FoundItems";
import ReportLost from "../pages/ReportLost";
import ReportFound from "../pages/ReportFound";
import ItemDetails from "../pages/ItemDetails";
import Matches from "../pages/Matches";
import Dashboard from "../pages/Dashboard";
import MyReports from "../pages/MyReports";
import MyMatches from "../pages/MyMatches";
import Messages from "../pages/Messages";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/lost" element={<LostItems />} />
        <Route path="/found" element={<FoundItems />} />
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/report-found" element={<ReportFound />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/my-matches" element={<MyMatches />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
