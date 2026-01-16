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
    <div className=" bg-purple-400 text-white p-5">
      <nav className="container mx-auto flex justify-between items-center">
        <Link
          to={"/home"}
          className="text-2xl font-bold hover:text-black transition-[1s] "
        >
          E-Commerce
        </Link>
        <button
          onClick={handelLogout}
          className="text-2xl hover:scale-110 transition"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
