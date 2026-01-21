import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { showDashboardSidebarAtom } from "../../atoms/DashBoardAtom";
import { useAtom } from "jotai";

export default function DashboardNavbar() {
  const [showDashboardSidebar, setShowDashboardSidebar] = useAtom(
    showDashboardSidebarAtom,
  );
  return (
    <div
      className="navbarp-4 w-100 fixed-top d-flex justify-content-between align-items-center shadow-sm"
      style={{
        backgroundColor: "#ffffff",
        minHeight: "78px",
        maxHeight: "78px",
      }}
    >
      <div
        className="p-3 shadow-sm d-flex align-items-center justify-content-between"
        style={{
          width: "250px",
          height: "78px",
        }}
      >
        <Link to={"/"} className="text-decoration-none text-dark  fw-bold">
          E-Commerce
        </Link>
        <FontAwesomeIcon
          onClick={() => setShowDashboardSidebar(!showDashboardSidebar)}
          icon={faBars}
          style={{
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
}
