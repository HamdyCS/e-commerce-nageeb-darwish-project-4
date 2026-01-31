import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { GET_AUTH_USER } from "../../../../Apis/Apis";
import Axios from "../../../../Apis/Axios";
import Loading from "../../../../components/ui/loading/Loading";
import { enRole, isEnRole } from "../../../../dtos/auth/Role";
import UserDto from "../../../../dtos/auth/UserDto";
import { getFromCookie } from "../../../../services/cookieService";

export default function RequireCustomAuth({ roles }: { roles: enRole[] }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDto | null>(null);

  const location = useLocation();

  //get user data
  useEffect(() => {
    async function fetchData() {
      try {
        const user = await Axios.get<UserDto>(GET_AUTH_USER).then(
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

  //check if loading
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
      to="/404"
    />
  );
}
