import React from "react";
import { Route, Routes } from "react-router-dom";
import Users from "./users/Users";
import NotFound from "../NotFound";
import DashboardTopBar from "../../components/dashboard/DashboardTopBar";
import { Col, Row } from "react-bootstrap";
import DashboardSidebar from "../../components/dashboard/DashboardSideBar";
import { useAtom } from "jotai";
import { showDashboardSidebarAtom } from "../../atoms/DashBoardAtom";
import { windowSizeAtom } from "../../atoms/WindowAtom";
import RequireAuth from "../website/auth/RequireAuth";
import UpdateUser from "./users/UpdateUser";

export default function Dashboard() {
  const [showDashboardSidebar, setShowDashboardSidebar] = useAtom(
    showDashboardSidebarAtom,
  );
  const [windowSize, setWindowSize] = useAtom(windowSizeAtom);

  return (
    <div className="dashboard">
      <DashboardTopBar />

      <div
        style={{
          marginTop: "78px",
        }}
      >
        <div
          className="position-fixed dashboard-sidebar-container "
          style={{
            height: "calc(100vh - 78px)",
            width: showDashboardSidebar
              ? windowSize <= 992
                ? "100px"
                : "250px"
              : "100px",
            backgroundColor: "#ffffff",
            left:
              windowSize <= 992
                ? showDashboardSidebar
                  ? "0"
                  : "-100%"
                : "0px",
          }}
        >
          <DashboardSidebar />
        </div>

        <div
          className="p-4 shadow-sm"
          style={{
            backgroundColor: "#f7f8fa",
            height: "2000px",
            marginLeft: showDashboardSidebar
              ? windowSize <= 992
                ? "0px"
                : "250px"
              : windowSize <= 992
                ? "0px"
                : "100px",
            width: showDashboardSidebar
              ? windowSize <= 992
                ? "100%"
                : "calc(100% - 250px)"
              : windowSize <= 992
                ? "100%"
                : "calc(100% - 100px)",
          }}
        >
          <Routes>
            <Route index element={<Users />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UpdateUser />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
