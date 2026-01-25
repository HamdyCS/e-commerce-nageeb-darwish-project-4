import {
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  ALL_USERS,
  DELETE_USER,
  GET_AUTH_USER as GET_AUTH_USER,
} from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import Loading from "../../../components/ui/loading/Loading";
import { getRoleNameByRoleNumber } from "../../../dtos/auth/Role";
import UserDto from "../../../dtos/auth/UserDto";

export default function Users() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  const [authUser, setAuthUser] = useState<UserDto>({} as UserDto);

  //get users
  useEffect(() => {
    async function fetchData() {
      try {
        //fetch users from api
        const data = await Axios.get<UserDto[]>(ALL_USERS).then(
          (res) => res.data,
        );

        data && setUsers(data);

        console.log(data);

        //get auth user
        const user = await Axios.get<UserDto>(`${GET_AUTH_USER}`).then(
          (res) => res.data,
        );

        user && setAuthUser(user);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [counter]);

  //delete user
  async function handelDelete(id: number) {
    try {
      //confirm delete
      const isConfirmed = window.confirm(
        `Are you sure you want to delete this user. User ID: ${id} ?`,
      );

      if (!isConfirmed) return;

      //set loading
      setLoading(true);

      //delete user from api
      const data = await Axios.delete(`${DELETE_USER(id.toString())}`).then(
        (res) => res.data,
      );

      //++ counter to run useEffect
      setCounter((prev) => prev + 1);

      //alert success message
      alert("User deleted successfully");
    } catch (err) {
      console.log(err);

      setLoading(false);
      //alert err message
      alert("Error on deleting user");
    } finally {
    }
  }

  //user elements
  const usersElements = users.map((user) => {
    const isAuthUser = authUser.id === user.id;
    return (
      <tr
        key={user.id}
        style={{
          opacity: isAuthUser ? "0.5" : "1",
        }}
      >
        <td>{user.id}</td>
        <td> {isAuthUser ? user.name + " (You)" : user.name}</td>
        <td>{user.email}</td>
        <td>{getRoleNameByRoleNumber(user.role)}</td>
        <td>{user.email_verified_at}</td>
        <td>{user.created_at}</td>
        <td>{user.updated_at}</td>
        <td>
          <div className="d-flex gap-3">
            <Link to={`/dashboard/users/${user.id}`}>
              <Button className="btn-secondary rounded px-4 py-2 d-flex justify-content-center align-items-center gap-1">
                <FontAwesomeIcon size="lg" icon={faPenToSquare} />
                <p className="p-0 m-0">Edit</p>
              </Button>
            </Link>
            {!isAuthUser && (
              <Button
                className="btn-danger rounded px-4 py-2 d-flex justify-content-center align-items-center gap-1"
                onClick={() => handelDelete(user.id)}
              >
                <FontAwesomeIcon size="lg" icon={faTrash} />{" "}
                <p className="p-0 m-0">Delete</p>
              </Button>
            )}
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div className="Users">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="text-dark fw-bold fs-1 mb-3 ">Users</h2>
        <Link to="/dashboard/users/add">
          <Button className="btn-primary rounded px-4 py-2 d-flex justify-content-center align-items-center gap-1">
            <FontAwesomeIcon size="lg" icon={faPlus} />
            <p className="p-0 m-0">Add</p>
          </Button>
        </Link>
      </div>
      <Table striped bordered hover variant="light" responsive>
        <thead>
          <tr>
            <th>Id </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Email verified at</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={8}>
                <Loading />
              </td>
            </tr>
          )}
          {!loading && users.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center fw-bold text-secondary">
                No users found!
              </td>
            </tr>
          )}
          {!loading && usersElements}
        </tbody>
      </Table>
    </div>
  );
}
