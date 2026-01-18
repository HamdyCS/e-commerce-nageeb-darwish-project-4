import React, { Activity, FormEvent, useState, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postAsync } from "../../../services/apiService";
import Loading from "../../../components/ui/loading/Loading";
import LoginDto from "../../../dtos/auth/LoginDto";
import LoginResponseDto from "../../../dtos/auth/LoginResponseDto";
import { setInCookie } from "../../../services/cookieService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Button, Form } from "react-bootstrap";

export default function LoginPage() {
  const [form, setForm] = useState<LoginDto>({} as LoginDto);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  //handel form changes
  function handelFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newForm = { ...form, [e.target.name]: e.target.value };

    //update form state
    setForm(newForm);
  }

  //handel form submit
  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    //reset error
    setError("");

    //validition form
    if (!form.email) {
      setError("email is required");
      return;
    }
    if (!form.password) {
      setError("Password is required");
      return;
    }

    if (!(form.password.length >= 9)) {
      setError("Password must be at least 9 characters long");
      return;
    }

    setLoading(true);

    try {
      //call api
      const loginResponseDto = await postAsync<LoginResponseDto>("login", form);

      //save token in cookie
      setInCookie("BearerToken", loginResponseDto.token);

      navigate("/home");
    } catch (error) {
      console.log(error);

      //set error message
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  //height: "calc(100vh - 70px)" => 70px is navbar height

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
          <h2 className="fw-bold mb-5">Login</h2>
          <Form className="w-100 mb-3" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
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
            {error && (
              <p className="text-danger text-center fw-bold">{error}❌</p>
            )}

            <div className="text-center">
              <Button variant="primary" type="submit">
                Login
              </Button>
            </div>
          </Form>

          <div className="text-black text-center mb-3">
            Don`t registered? <Link to={"/register"}>Register</Link>
          </div>
          <a
            href="http://127.0.0.1:8000/login-google"
            className="bg-white p-2 rounded-2 w-100 cursor-pointer position-relative text-decoration-none bg-primary-subtle"
          >
            <FontAwesomeIcon
              icon={faGoogle}
              className="position-absolute top-50 translate-middle-y"
            />
            <p className=" text-center mb-0">Login with Google</p>
          </a>
        </div>
      </Activity>
    </div>
  );
}
