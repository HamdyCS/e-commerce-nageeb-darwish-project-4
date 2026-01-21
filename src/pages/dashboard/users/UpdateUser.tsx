import React, {
  Activity,
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserDto from "../../../dtos/auth/UserDto";
import Axios from "../../../Apis/Axios";
import { Get_User, Update_User } from "../../../Apis/Apis";
import Loading from "../../../components/ui/loading/Loading";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import UpdateUserDto from "../../../dtos/auth/UpdateUserDto";

export default function UpdateUser() {
  const userId = useParams().id;

  const [user, setUser] = useState<UserDto>({} as UserDto);
  const [userForm, setUserForm] = useState<UpdateUserDto>({} as UpdateUserDto);

  const [error, setError] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [isActionDone, setIsActionDone] = useState<boolean>(false);

  const navigate = useNavigate();

  //get user info by id
  useEffect(() => {
    async function fetchData() {
      if (!userId) return;

      try {
        const data = await Axios.get<UserDto>(`${Get_User(userId)}`).then(
          (res) => res.data,
        );

        //update userInfo
        data && setUser(data);

        //update user form info
        setUserForm({
          name: data.name,
          email: data.email,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  //fire alert when action done
  useEffect(() => {
    if (!isActionDone) return;

    Swal.fire({
      icon: "success",
      title: "User updated successfully",
      showConfirmButton: false,
      showCancelButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then(() => navigate("/dashboard/users"));
  }, [isActionDone]);

  //handel form change
  function handelFormChange(event: ChangeEvent<HTMLInputElement>): void {
    const newUserForm = {
      ...userForm,
      [event.target.name]: event.target.value,
    };

    //update user form state
    setUserForm(newUserForm);
  }

  //handel form submit
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    //reset error
    setError("");

    //validition form
    if (!userForm.name) {
      setError("Name is required");
      return;
    }
    if (!userForm.email) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      console.log(userForm);

      //call api
      const data = await Axios.post<UpdateUserDto>(
        `${Update_User(user.id.toString())}`,
        userForm,
      ).then((res) => res.data);

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
          <h2 className="fw-bold mb-3 text-center">Update User</h2>
          <Form className="w-100" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="id">
              <Form.Label disabled>Id</Form.Label>
              <Form.Control
                disabled
                type="text"
                name="id"
                placeholder="id"
                value={user.id}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="name"
                onChange={handelFormChange}
                value={userForm.name}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                placeholder="email"
                onChange={handelFormChange}
                value={userForm.email}
              />
            </Form.Group>

            {error && (
              <p className="text-danger text-center fw-bold mb-3">{error}❌</p>
            )}

            <div className="text-center">
              <Button variant="primary" type="submit">
                Update
              </Button>
            </div>
          </Form>
        </div>
      </Activity>
    </div>
  );
}
