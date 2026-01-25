import { Activity, FormEvent, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ADD_USER } from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import Loading from "../../../components/ui/loading/Loading";
import AddUserDto from "../../../dtos/auth/AddUserDto";
import { enRole, Role } from "../../../dtos/auth/Role";
import UserDto from "../../../dtos/auth/UserDto";
interface FormType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}
export default function AddUser() {
  const [form, setForm] = useState<FormType>({} as FormType);

  const [error, setError] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [isActionDone, setIsActionDone] = useState<boolean>(false);

  const navigate = useNavigate();

  //use it when registerDone is true
  useEffect(() => {
    if (!isActionDone) return;

    Swal.fire({
      icon: "success",
      title: "Adding New User Successful",
      showConfirmButton: false,
      showCancelButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then(() => navigate("/dashboard/users"));
  }, [isActionDone, navigate]);

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

    //validition role
    if (!form.role) {
      setError("Please select role");
      return;
    }

    try {
      setLoading(true);

      const addUserDto: AddUserDto = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      //call api
      const data = await Axios.post(ADD_USER, addUserDto).then(
        (res) => res.data,
      );

      //set to true to show alert
      setIsActionDone(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  //check if loading
  if (loading)
    return (
      <div className="flex justify-content-center">
        <Loading />
      </div>
    );

  return (
    <div>
      {loading && <Loading />}
      <Activity mode={loading ? "hidden" : "visible"}>
        <div>
          <h2 className="fw-bold mb-3 text-center">Add User</h2>
          <Form className="w-100" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="id">
              <Form.Label disabled>Id</Form.Label>
              <Form.Control disabled type="text" name="id" placeholder="id" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="name"
                onChange={handelFormChange}
                value={form.name}
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
            <Form.Group className="mb-3" controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Select
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as Role })
                }
              >
                <option disabled selected>
                  Select Role
                </option>
                <option value={enRole.admin}>Admin</option>
                <option value={enRole.writer}>Writer</option>
                <option value={enRole.user}>User</option>
                <option value={enRole.productManager}>Product Manager</option>
              </Form.Select>
            </Form.Group>

            {error && (
              <p className="text-danger text-center fw-bold mb-3">{error}❌</p>
            )}

            <div className="text-center">
              <Button variant="primary" type="submit">
                Add User
              </Button>
            </div>
          </Form>
        </div>
      </Activity>
    </div>
  );
}
