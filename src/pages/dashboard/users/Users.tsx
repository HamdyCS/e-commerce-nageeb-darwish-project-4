import React, { useEffect, useState } from "react";
import UserDto from "../../../dtos/auth/UserDto";
import { deleteAsync, getAsync } from "../../../services/apiService";
import { getFromCookie } from "../../../services/cookieService";
import Loading from "../../../components/ui/loading/Loading";
import { Button, Table } from "react-bootstrap";
import {
  All_Users,
  Delete_User,
  Get_Current_User as Get_Auth_User,
} from "../../../Apis/Apis";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Axios from "../../../Apis/Axios";

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
        const data = await Axios.get<UserDto[]>(All_Users).then(
          (res) => res.data,
        );

        data && setUsers(data);

        //get auth user
        const user = await Axios.get<UserDto>(`${Get_Auth_User}`).then(
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
      const data = await Axios.delete(`${Delete_User(id.toString())}`).then(
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

  const filterUsers = users.filter((user) => user.id !== authUser.id);
  //user elements
  const usersElements = filterUsers.map((user) => {
    return (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.email_verified_at}</td>
        <td>{user.created_at}</td>
        <td>{user.updated_at}</td>
        <td>
          <div className="d-flex gap-3">
            <Link to={`/dashboard/users/${user.id}`}>
              <Button className="btn-primary rounded px-4 py-2 d-flex justify-content-center align-items-center gap-1">
                <FontAwesomeIcon size="lg" icon={faPenToSquare} />
                <p className="p-0 m-0">Edit</p>
              </Button>
            </Link>
            <Button
              className="btn-danger rounded px-4 py-2 d-flex justify-content-center align-items-center gap-1"
              onClick={() => handelDelete(user.id)}
            >
              <FontAwesomeIcon size="lg" icon={faTrash} />{" "}
              <p className="p-0 m-0">Delete</p>
            </Button>{" "}
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div className="Users">
      <Table striped bordered hover variant="light" responsive>
        <caption
          className="text-dark fw-bold fs-1 mb-3 "
          style={{ captionSide: "top" }}
        >
          Users
        </caption>
        <thead>
          <tr>
            <th>Id </th>
            <th>Name</th>
            <th>Email</th>
            <th>Email verified at</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={7}>
                <Loading />
              </td>
            </tr>
          )}
          {!loading && filterUsers.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center fw-bold text-secondary">
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
