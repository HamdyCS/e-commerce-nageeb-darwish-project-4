import React from "react";
import "./App.css";
import { API_URL } from "./config";
import { Route, Router, Routes } from "react-router-dom";
import HomePage from "./pages/website/HomePage";
import NotFound from "./pages/NotFound";
import Register from "./pages/website/auth/RegisterPage";
import LoginPage from "./pages/website/auth/LoginPage";
import Layout from "./components/website/Layout";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <div className="App text-lg font-[lato] bg-[#0C172C]  text-white">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
