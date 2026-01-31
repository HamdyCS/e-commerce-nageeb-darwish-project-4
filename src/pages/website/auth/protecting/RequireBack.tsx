import { Outlet, useLocation } from "react-router-dom";
import { getFromCookie } from "../../../../services/cookieService";

export default function RequireBack() {
  const location = useLocation();

  const token = getFromCookie("BearerToken");

  //check if user is already login
  if (token) window.history.back();

  return <Outlet />;
}
