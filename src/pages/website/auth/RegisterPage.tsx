import React, { Activity, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { postAsync } from "../../../services/apiService";
import RegisterDto from "../../../dtos/auth/RegisterDto";
import Swal from "sweetalert2";
import Loading from "../../../components/ui/Loading";

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

    setLoading(true);

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
    <div className="h-screen ">
      <div className="flex items-center justify-center lg:p-12 p-8  w-full h-full">
        <form className="max-w-lg w-full mx-auto" onSubmit={handleSubmit}>
          {loading && <Loading />}
          <Activity mode={loading ? "hidden" : "visible"}>
            <div className="mb-12">
              <h1 className="text-3xl font-semibold text-purple-400 text-center">
                Register
              </h1>
            </div>
            <div>
              <label
                htmlFor="name"
                className="text-white text-xs block mb-2 pl-2"
              >
                Full Name
              </label>
              <div className="relative flex items-center">
                <input
                  name="name"
                  id="name"
                  type="text"
                  className="w-full bg-transparent text-sm text-white border-b border-slate-500 focus:border-white pl-2 pr-8 py-3 outline-none rounded-md"
                  placeholder="Name"
                  onChange={handelFormChange}
                />
              </div>
            </div>
            <div className="mt-8">
              <label
                htmlFor="email"
                className="text-white text-xs block mb-2 pl-2"
              >
                Email
              </label>
              <div className="relative flex items-center">
                <input
                  name="email"
                  type="text"
                  id="email"
                  className="w-full bg-transparent text-sm text-white border-b border-slate-500 focus:border-white pl-2 pr-8 py-3 outline-none rounded-md"
                  placeholder="Email"
                  onChange={handelFormChange}
                />
              </div>
            </div>
            <div className="mt-8">
              <label
                htmlFor="password"
                className="text-white text-xs block mb-2 pl-2"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  name="password"
                  id="password"
                  type="password"
                  className="w-full bg-transparent text-sm text-white border-b border-slate-500 focus:border-white pl-2 pr-8 py-3 outline-none rounded-md"
                  placeholder="Password"
                  onChange={handelFormChange}
                />
              </div>
            </div>
            <div className="mt-8">
              <label
                htmlFor="confirmPassword"
                className="text-white text-xs block mb-2 pl-2"
              >
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <input
                  name="confirmPassword"
                  id="confirmPassword"
                  type="password"
                  className="w-full bg-transparent text-sm text-white border-b border-slate-500 focus:border-white pl-2 pr-8 py-3 outline-none rounded-md"
                  placeholder="Confirm password"
                  onChange={handelFormChange}
                />
              </div>
            </div>
            {error && (
              <p className="mt-8 font-bold text-red-500 text-center">
                ❌ {error}
              </p>
            )}
            <div className="mt-8">
              <div className="text-center">
                <Button type="submit" text="Register" />
              </div>
              <p className="text-sm text-slate-300 mt-8 text-center">
                Already have an account?
                <Link
                  to={"/login"}
                  className="text-purple-400 font-medium hover:underline ml-1"
                >
                  Login
                </Link>
              </p>
            </div>
          </Activity>
        </form>
      </div>
    </div>
  );
}
