import React, { Activity, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postAsync } from "../../../services/apiService";
import RegisterDto from "../../../dtos/auth/RegisterDto";
import Swal from "sweetalert2";
import Loading from "../../../components/ui/loading/Loading";
import { Button, Form } from "react-bootstrap";

interface FormType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export default function Register() {
  const [form, setForm] = useState<FormType>({} as FormType);
  const [error, setError] = useState<string>("");
  const [registerDone, setRegisterDone] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  //use it when registerDone is true
  useEffect(() => {
    if (!registerDone) return;

    Swal.fire({
      icon: "success",
      title: "Registration Successful",
      showConfirmButton: false,
      showCancelButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then(() => navigate("/home"));
  }, [registerDone]);

  //handel form changes
  function handelFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newForm = { ...form, [e.target.name]: e.target.value };

    //update form state
    setForm(newForm);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    //reset error
    setError("");

    //validition form
    if (!form.name) {
      setError("Name is required");
      return;
    }
    if (!form.email) {
      setError("email is required");
      return;
    }

    //validtion passwords
    if (!form.password) {
      setError("Password is required");
      return;
    }

    if (!(form.password.length >= 9)) {
      setError("Password must be at least 9 characters long");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const registerDto: RegisterDto = {
        name: form.name,
        email: form.email,
        password: form.password,
      };

      //call api
      await postAsync("register", registerDto);

      //set to true to show alert
      setRegisterDone(true);

      //navigate to login page
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="w-100 d-flex justify-content-center align-items-center"
      style={{
        height: "calc(100vh - 70px)",
      }}
    >
      {loading && <Loading />}
      <Activity mode={loading ? "hidden" : "visible"}>
        <div
          className="d-flex flex-column align-items-center lg:p-12 p-8 w-100 p-5 rounded-3 bg-white shadow-lg"
          style={{
            maxWidth: "500px",
          }}
        >
          <h2 className="fw-bold mb-5">Register</h2>
          <Form className="w-100 mb-3" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="name"
                onChange={handelFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                placeholder="email"
                onChange={handelFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                onChange={handelFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handelFormChange}
              />
            </Form.Group>

            {error && (
              <p className="text-danger text-center fw-bold mb-3">{error}❌</p>
            )}

            <div className="text-center">
              <Button variant="primary" type="submit">
                Register
              </Button>
            </div>
          </Form>
          <div className="text-black text-center ">
            Aready Login? <Link to={"/login"}>login</Link>
          </div>
        </div>
      </Activity>
    </div>
  );
}
