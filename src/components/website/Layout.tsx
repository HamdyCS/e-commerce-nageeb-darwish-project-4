import React from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="layout ">
      <Navbar />
      <div className="p-5 container mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
