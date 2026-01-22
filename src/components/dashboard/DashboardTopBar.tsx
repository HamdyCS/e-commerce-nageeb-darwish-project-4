import {
  faArrowRightFromBracket,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showDashboardSidebarAtom } from "../../atoms/DashBoardAtom";
import { useAtom } from "jotai";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import UserDto from "../../dtos/auth/UserDto";
import { getFromCookie, removeFromCookie } from "../../services/cookieService";
import { getAsync } from "../../services/apiService";
import { Get_Current_User, Logout } from "../../Apis/Apis";
import Loading from "../ui/loading/Loading";
import Axios from "../../Apis/Axios";

export default function DashboardNavbar() {
  const [showDashboardSidebar, setShowDashboardSidebar] = useAtom(
    showDashboardSidebarAtom,
  );

  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  //get user
  useEffect(() => {
    async function fetchData() {
      try {
        const user = await Axios.get<UserDto>(Get_Current_User).then(
          (res) => res.data,
        );
        user && setUser(user);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  //
  async function handelLogout() {
    try {
      //call api
      const data = await Axios.get(Logout).then((res) => res.data);
      console.log(data);

      //remove token from cookie
      removeFromCookie("BearerToken");

      navigate("/login");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

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

      <DropdownButton
        className="me-3 rounded"
        id="dropdown-basic-button"
        title={user?.name.split(" ")[0]}
      >
        {loading && <Loading />}
        {!loading && (
          <Dropdown.Item
            as="button"
            onClick={handelLogout}
            style={{
              cursor: "pointer",
            }}
          >
            logout
          </Dropdown.Item>
        )}
      </DropdownButton>
    </div>
  );
}
