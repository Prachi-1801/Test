import { useEffect } from "react";
import { useGetUsersQuery } from "./api/ChatAxiosApi";

const Test = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();

  useEffect(() => {
    console.log("users", UserList());
  });

  function UserList() {
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading users</p>;
    return users;
  }
};

export default Test;
