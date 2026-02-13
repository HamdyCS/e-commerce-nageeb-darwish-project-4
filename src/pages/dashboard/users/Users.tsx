import { ChangeEvent, useEffect, useState } from "react";
import {
  ALL_USERS,
  COUNT_USERS,
  DELETE_USER,
  GET_AUTH_USER,
  SEARCH_USERS,
} from "../../../Apis/Apis";
import Axios from "../../../Apis/Axios";
import CustomTable, {
  BaseTableDataType,
  TableHeaderType,
} from "../../../components/ui/CustomTable";
import { getRoleNameByRoleNumber } from "../../../dtos/auth/Role";
import UserDto from "../../../dtos/auth/UserDto";
import { Default_PAGE_SIZE } from "../../../config";
import Pagination from "../../../components/ui/pagination/Pagination";
import { formatDate } from "../../../helper/helper";

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

  //search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateQuery, setDateQuery] = useState<string>("");

  //pagination states
  const [pageSize, setPageSize] = useState<number>(Default_PAGE_SIZE);
  const [countOfItems, setCountOfItems] = useState<number>(0);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);

  //get users
  useEffect(() => {
    async function fetchData() {
      try {
        !loading && setLoading(true);

        //fetch users from api
        const data: { data: UserDto[]; total: number } = await Axios.get(
          `${ALL_USERS}?limit=${pageSize}&page=${currentPageNumber}`,
        ).then((res) => res.data);


        setCountOfItems(data.total);

        //get auth user
        const user = await Axios.get<UserDto>(`${GET_AUTH_USER}`).then(
          (res) => res.data,
        );

        data && setUsers(data.data);

        user && setAuthUser(user);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [counter, currentPageNumber, pageSize]);

  //search users
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        //if search query is empty
        if (!searchQuery) {
          setCounter((prev) => prev + 1);
          return;
        }

        //call api to search categories
        const data = await Axios.post<UserDto[]>(
          `${SEARCH_USERS}?title=${searchQuery}`,
        ).then((res) => res.data);

        setUsers(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    const timer1 = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer1);
  }, [searchQuery]);

  //search by date
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        //if search query is empty
        if (!dateQuery) {
          setCounter((prev) => prev + 1);
          return;
        }

        //call api to search categories
        const data: UserDto[] = await Axios.get(ALL_USERS).then(
          (res) => res.data.data,
        );

        const filterData = data.filter(
          (user) => formatDate(user.created_at) === formatDate(dateQuery),
        );

        setUsers(filterData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dateQuery]);

  //handel search
  async function handleSearch(searchQuery: string) {
    setSearchQuery(searchQuery);
  }

  //handel date search
  async function handelDateSearch(dateString: string) {
    setDateQuery(dateString);
  }

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
      <CustomTable<TableDataType>
        tableHeader={tableHeader}
        data={tableData}
        tableName="Users"
        addPath="/dashboard/users/add"
        isLoading={loading}
        handleSearch={handleSearch}
        handelDateSearch={handelDateSearch}
      />
      {!searchQuery && (
        <Pagination
          setCurrentPageNumber={setCurrentPageNumber}
          pageNumber={currentPageNumber}
          countOfItems={countOfItems}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      )}
    </div>
  );
}
