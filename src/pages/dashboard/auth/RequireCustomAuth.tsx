import React, { useEffect, useState } from "react";
import { getFromCookie } from "../../../services/cookieService";
import { getAsync } from "../../../services/apiService";
import { Get_Current_User } from "../../../Apis/Apis";
import UserDto from "../../../dtos/auth/UserDto";
import Loading from "../../../components/ui/loading/Loading";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Axios from "../../../Apis/Axios";
import { enRole, isEnRole, Role } from "../../../dtos/auth/Role";

export default function RequireCustomAuth({ roles }: { roles: enRole[] }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDto | null>(null);

  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await Axios.get<UserDto>(Get_Current_User).then(
          (res) => res.data,
        );
        user && setUser(user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="p-5">
        {" "}
        <Loading />
      </div>
    );

  return user && isEnRole(user?.role) && roles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate
      state={{
        from: location,
      }}
      to="/dashboard/403"
    />
  );
}
