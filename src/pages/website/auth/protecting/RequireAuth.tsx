import React, { useEffect, useState } from "react";
import { getFromCookie } from "../../../../services/cookieService";
import { getAsync } from "../../../../services/apiService";
import { GET_AUTH_USER } from "../../../../Apis/Apis";
import UserDto from "../../../../dtos/auth/UserDto";
import Loading from "../../../../components/ui/loading/Loading";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function RequireAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDto | null>(null);

  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = getFromCookie("BearerToken");
        if (token === null) {
          setLoading(false);
          return;
        }

        const user = await getAsync<UserDto>(GET_AUTH_USER, token);
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
        <Loading />
      </div>
    );
  return user ? (
    <Outlet />
  ) : (
    <Navigate
      state={{
        from: location,
      }}
      to="/login"
    />
  );
}
