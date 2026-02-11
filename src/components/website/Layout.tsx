import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();

  //if pathname includes dashboard
  if (location.pathname.includes("dashboard")) return <Outlet />;

  return (
    <div className="layout ">
      <Navbar />
      <div
        className="container mx-auto p-3"
        style={{
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
