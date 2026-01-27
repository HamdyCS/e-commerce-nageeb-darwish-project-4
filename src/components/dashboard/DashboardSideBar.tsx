import {
  faFilePen,
  faLayerGroup,
  faPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { GET_AUTH_USER } from "../../Apis/Apis";
import Axios from "../../Apis/Axios";
import { showDashboardSidebarAtom } from "../../atoms/DashBoardAtom";
import { windowSizeAtom } from "../../atoms/WindowAtom";
import { enRole, isEnRole } from "../../dtos/auth/Role";
import UserDto from "../../dtos/auth/UserDto";
import Loading from "../ui/loading/Loading";
import "./DashboardBars.css";

const links = [
  {
    path: "/dashboard/users",
    icon: faUsers,
    name: "Users",
    avalibaleRoles: [enRole.admin],
  },
  {
    path: "/dashboard/users/add",
    icon: faPlus,
    name: "Add User",
    avalibaleRoles: [enRole.admin],
  },
  {
    path: "/dashboard/posts",
    icon: faFilePen,
    name: "Posts",
    avalibaleRoles: [enRole.admin, enRole.writer],
  },
  {
    path: "/dashboard/categories",
    icon: faLayerGroup,
    name: "Categories",
    avalibaleRoles: [enRole.admin, enRole.productManager],
  },
  {
    path: "/dashboard/categories/add",
    icon: faPlus,
    name: "Add Category",
    avalibaleRoles: [enRole.admin, enRole.productManager],
  },
];

export default function DashboardSidebar() {
  const [showDashboardSidebar, setShowDashboardSidebar] = useAtom(
    showDashboardSidebarAtom,
  );
  const [windowSize, setWindowSize] = useAtom(windowSizeAtom);
  const [authUser, setAuth] = useState<UserDto>({} as UserDto);
  const [loading, setLoading] = useState<boolean>(true);

  //get auth user info
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await Axios.get<UserDto>(`${GET_AUTH_USER}`).then(
          (res) => res.data,
        );

        //update userInfo
        data && setAuth(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const listItemElements =
    (!loading &&
      authUser.id &&
      links.map((link, index) => {
        //check if this user has role to show this element
        if (
          isEnRole(authUser.role) &&
          !link.avalibaleRoles.includes(authUser.role)
        ) {
          return <></>;
        }

        return (
          <li className="mb-4" key={index}>
            <NavLink
              end
              to={link.path}
              className={(x) =>
                `${x.isActive ? "active" : ""} link text-black d-flex gap-3 align-items-center  text-decoration-none px-2 py-1 rounded
              `
              }
              style={{
                justifyContent: showDashboardSidebar ? "left" : "center",
              }}
            >
              <div className="flex-grow-1 flex-lg-grow-0 text-center">
                <FontAwesomeIcon icon={link.icon} />
              </div>

              {showDashboardSidebar && (
                <span className="d-none d-lg-inline">{link.name}</span>
              )}
            </NavLink>
          </li>
        );
      })) ||
    [];

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
        {loading && <Loading />}
        {!loading && (
          <ul className="p-0 list-unstyled side-bar-list  mt-4">
            {listItemElements}
          </ul>
        )}
      </div>
    </>
  );
}
