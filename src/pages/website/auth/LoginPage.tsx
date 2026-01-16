import React, { Activity, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postAsync } from "../../../services/apiService";
import Button from "../../../components/ui/Button";
import Loading from "../../../components/ui/Loading";
import LoginDto from "../../../dtos/auth/LoginDto";
import LoginResponseDto from "../../../dtos/auth/LoginResponseDto";
import { setInCookie } from "../../../services/cookieService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    //reset error
    setError("");

    setLoading(true);

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

  return (
    <div className="bg-white md:h-screen">
      <div className="flex flex-col items-center lg:p-12 p-8 bg-[#0C172C] h-screen w-full space-y-5">
        <form className="max-w-lg w-full mx-auto" onSubmit={handleSubmit}>
          {loading && <Loading />}
          <Activity mode={loading ? "hidden" : "visible"}>
            <div className="mb-12">
              <h1 className="text-3xl font-semibold text-purple-400 text-center">
                Login
              </h1>
            </div>

            <div>
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

            {error && (
              <p className="mt-8 font-bold text-red-500 text-center">
                ❌ {error}
              </p>
            )}
            <div className="mt-8">
              <div className="text-center">
                <Button type="submit" text="Login" />
              </div>
              <p className="text-sm text-slate-300 mt-8 text-center">
                Donot have account?
                <Link
                  to={"/register"}
                  className="text-purple-400 font-medium hover:underline ml-1"
                >
                  Register
                </Link>
              </p>
            </div>
          </Activity>
        </form>
        <div
          className="bg-white p-2 rounded-md w-full max-w-lg relative cursor-pointer border border-purple-200
        hover:bg-transparent transition text-black  hover:text-white"
        >
          <FontAwesomeIcon
            icon={faGoogle}
            className=" absolute top-1/2 translate-y-[-50%]"
          />
          <p className=" text-center ">Login with Google</p>
        </div>
      </div>
    </div>
  );
}
