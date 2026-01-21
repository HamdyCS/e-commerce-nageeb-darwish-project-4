import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./DashboardBars.css";
import { useAtom } from "jotai";
import { showDashboardSidebarAtom } from "../../atoms/DashBoardAtom";
import { windowSizeAtom } from "../../atoms/WindowAtom";

export default function DashboardSidebar() {
  const [showDashboardSidebar, setShowDashboardSidebar] = useAtom(
    showDashboardSidebarAtom,
  );
  const [windowSize, setWindowSize] = useAtom(windowSizeAtom);

  return (
    <>
      <div
        className="position-fixed w-100 top-0 "
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          marginTop: "78px",
          height: "calc(100vh - 78px)",
          left: "0",
          zIndex: "-1",
          display: showDashboardSidebar && windowSize <= 992 ? "block" : "none",
        }}
      ></div>
      <div
        className="h-100  p-2"
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        {showDashboardSidebar && windowSize > 992 && (
          <p className="px-2">Dashboard</p>
        )}
        <ul className="p-0 list-unstyled side-bar-list  mt-4">
          <li className="mb-4">
            <NavLink
              to="/dashboard/users"
              className={(x) =>
                `link text-black ${x.isActive ? "active" : ""} d-flex gap-3 align-items-center  text-decoration-none px-2 py-1 rounded
              `
              }
              style={{
                justifyContent: showDashboardSidebar ? "left" : "center",
              }}
            >
              <div className="flex-grow-1 flex-lg-grow-0 text-center">
                <FontAwesomeIcon icon={faUsers} />
              </div>

              {showDashboardSidebar && (
                <span className="d-none d-lg-inline">Users</span>
              )}
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}
