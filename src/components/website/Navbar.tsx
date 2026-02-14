import { FormEvent, useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import NavbarBoot from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { getAsync } from "../../services/apiService";
import { getFromCookie, removeFromCookie } from "../../services/cookieService";
import {
  faCartShopping,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CategoryDto from "../../dtos/category/CategoryDto";
import Axios from "../../Apis/Axios";
import { CATEGORIES } from "../../Apis/Apis";
import { stringSlice } from "../../helper/helper";
import Skeleton from "react-loading-skeleton";
import CartModal from "../../pages/website/cart/CartModal";

export default function Navbar() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const token = getFromCookie("BearerToken");

  //get categories
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await Axios.get<CategoryDto[]>(CATEGORIES).then(
          (res) => res.data,
        );

        const sliceData = data.slice(0, 5);

        setCategories(sliceData);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

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

  //handle search
  async function handelSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  const categoryElements = categories.map((category) => (
    <div key={category.id}>
      <Link
        to={`/categories/${category.id}`}
        className="text-black text-decoration-none"
      >
        {stringSlice(category.title)}
      </Link>
    </div>
  ));

  categoryElements.push(
    <div key={categoryElements.length}>
      <Link to="/categories" className="text-black text-decoration-none">
        All
      </Link>
    </div>,
  );

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const skeletonElements = Array.from({ length: 6 }).map((_, index) => (
    <Skeleton key={index} width="116.016px" height="30px" />
  ));

  return (
    <NavbarBoot className="bg-light p-3 d-block">
      {show && <CartModal onClose={handleClose} />}
      <div className="container d-flex flex-wrap justify-content-between align-items-center">
        <Link
          to="/"
          className="text-black fs-3 fw-bold text-decoration-none position-relative"
        >
          <img
            src={require("../../assets/images/logo.png")}
            alt="logo"
            style={{
              width: "200px",
              height: "200px",
              objectFit: "contain",
              position: "absolute",
              top: "-70px",
              left: "-50%",
              zIndex: 1,
              opacity: 0.3,
            }}
          />

          <div className="" style={{ zIndex: 2 }}>
            <p className="m-0">E-commerce</p>
            <p
              className="fw-normal m-0"
              style={{ fontSize: "15px", color: "gray" }}
            >
              By Hamdy Khaled
            </p>
          </div>
        </Link>
        <Form
          onSubmit={handelSubmit}
          className="d-flex align-items-center w-50 order-2 order-md-1 mt-3 mt-md-0"
        >
          <Form.Control
            type="search"
            placeholder="Search product"
            className="w-100"
          />
          <Button type="submit" className="btn-info">
            Search
          </Button>
        </Form>
        <div className="order-1 order-md-2">
          {!token && (
            <Link to="/login" className="text-decoration-none">
              <Button type="submit" className="btn-info">
                Login
              </Button>
            </Link>
          )}
          {token && (
            <div className="d-flex align-items-center gap-2 text-decoration-none ">
              <Link to={"/"}>
                <FontAwesomeIcon
                  onClick={handleShow}
                  icon={faCartShopping}
                  size="xl"
                />
              </Link>
              <Link to={"/"}>
                <FontAwesomeIcon icon={faCircleUser} size="xl" />
              </Link>
            </div>
          )}
        </div>
      </div>
      <div
        className="mt-4 d-flex flex-wrap gap-5 align-items-center  container position-relative"
        style={{
          zIndex: 10,
        }}
      >
        {isLoading ? skeletonElements : categoryElements}
      </div>
    </NavbarBoot>
  );
}
