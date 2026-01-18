import React, { useEffect, useState } from "react";
import UserDto from "../../dtos/auth/UserDto";
import { getAsync } from "../../services/apiService";
import { getFromCookie } from "../../services/cookieService";
import Loading from "../../components/ui/loading/Loading";

export default function Users() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //get users
  useEffect(() => {
    async function fetchData() {
      try {
        //fetch users from api
        const response = await getAsync<UserDto[]>(
          "users",
          getFromCookie("BearerToken") || ""
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [users]);

  return <div className="Users h-screen">{loading && <Loading />}</div>;
}
