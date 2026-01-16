import React from "react";
import { Route, Routes } from "react-router-dom";
import Users from "./Users";
import NotFound from "../NotFound";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Routes>
        <Route index element={<Users />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
