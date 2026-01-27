import { useEffect, useState } from "react";
import { ALL_USERS, DELETE_USER, GET_AUTH_USER } from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import CustomTable, {
  BaseTableDataType,
  TableHeaderType,
} from "../../../components/ui/CustomTable";
import Loading from "../../../components/ui/loading/Loading";
import { getRoleNameByRoleNumber } from "../../../dtos/auth/Role";
import UserDto from "../../../dtos/auth/UserDto";

//لازم يرث ال BaseTableDataType => اللي انا عاملها
//اللي فيها ال property الزيادة
interface TableDataType extends BaseTableDataType, UserDto {
  roleName: string;
}

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
      const data = await Axios.delete(`${DELETE_USER(Number(id))}`).then(
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

  //table header
  //لازم المفتاح يكون نفس اسم البروبرتي في قعدة البيانات
  const tableHeader: TableHeaderType[] = [
    { name: "Id", key: "id" },
    { name: "Name", key: "name" },
    { name: "Email", key: "email" },
    { name: "Email verified at", key: "email_verified_at" },
    { name: "Role", key: "roleName" },
    { name: "Created at", key: "created_at" },
    { name: "Updated at", key: "updated_at" },
  ];

  //table data
  const tableData: TableDataType[] = users.map((user) => {
    //check if user is auth user
    const isAuthUser = authUser.id === user.id;

    return {
      ...user,
      roleName: getRoleNameByRoleNumber(user.role),
      name: isAuthUser ? `${user.name} (You)` : user.name,
      disabled: isAuthUser,
      onDelete: handelDelete,
      showDeleteButton: !isAuthUser,
      updatePath: `/dashboard/users/${user.id}`,
    };
  });

  return (
    <div className="users">
      {loading && <Loading />}

      {!loading && (
        <CustomTable<TableDataType>
          tableHeader={tableHeader}
          data={tableData}
          tableName="Users"
          addPath="/dashboard/users/add"
        />
      )}
    </div>
  );
}
