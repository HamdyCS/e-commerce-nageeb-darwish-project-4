import Button from "react-bootstrap/Button";
import NavbarBoot from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { getAsync } from "../../services/apiService";
import { getFromCookie, removeFromCookie } from "../../services/cookieService";

export default function Navbar() {
  const navigate = useNavigate();

  //handle logout
  async function handelLogout() {
    try {
      await getAsync("logout", getFromCookie("BearerToken") || "");

      //remove token from cookie
      removeFromCookie("BearerToken");

      //navigate to login page
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <NavbarBoot className="bg-primary p-3 ">
      <div className="container flex justify-content-between align-items-center">
        <Link to="/" className="text-black fs-3 fw-bold">
          E-commerce
        </Link>

        <Link to="/login" className="text-decoration-none">
          <Button type="submit" className="btn-info">
            Login
          </Button>
        </Link>
      </div>
    </NavbarBoot>
  );
}
