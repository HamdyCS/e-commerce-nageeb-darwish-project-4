import { useAtom } from "jotai";
import { Route, Routes } from "react-router-dom";
import { showDashboardSidebarAtom } from "../../atoms/DashBoardAtom";
import { windowSizeAtom } from "../../atoms/WindowAtom";
import DashboardSidebar from "../../components/dashboard/DashboardSideBar";
import DashboardTopBar from "../../components/dashboard/DashboardTopBar";
import { enRole } from "../../dtos/auth/Role";
import ForbiddenPage from "../website/auth/errors/ForbiddenPage";
import NotFound from "../website/errors/NotFound";
import AddCategory from "./categories/AddCategory";
import Categories from "./categories/Categories";
import UpdateCategory from "./categories/UpdateCategory";
import "./Dashboard.css";
import AddProduct from "./products/AddProduct";
import Products from "./products/Products";
import RequireCustomAuthDashboard from "./protecting/RequireCustomAuthDashboard";
import AddUser from "./users/AddUser";
import UpdateUser from "./users/UpdateUser";
import Users from "./users/Users";
import UpdateProduct from "./products/UpdateProduct";

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
            minHeight: `calc(100vh - 78px)`,
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
            <Route
              index
              element={<h1 className="text-center">Welcome back😍</h1>}
            />
            {/* Admin */}
            <Route
              element={<RequireCustomAuthDashboard roles={[enRole.admin]} />}
            >
              <Route path="/users" element={<Users />} />
              <Route path="/users/add" element={<AddUser />} />
              <Route path="/users/:id" element={<UpdateUser />} />
            </Route>

            {/* Writer and admin */}
            <Route
              element={
                <RequireCustomAuthDashboard
                  roles={[enRole.admin, enRole.writer]}
                />
              }
            >
              <Route
                path="/posts"
                element={<h2 className="text-center">Posts</h2>}
              />
            </Route>
            {/* Product manager and admin */}
            <Route
              element={
                <RequireCustomAuthDashboard
                  roles={[enRole.admin, enRole.productManager]}
                />
              }
            >
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/add" element={<AddCategory />} />
              <Route path="/categories/:id" element={<UpdateCategory />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/:id" element={<UpdateProduct />} />
            </Route>

            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
