import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../api/users";
import { useUser } from "../../contexts/useUser";

function UserInitializer() {
  const { setUser, clearUser } = useUser();

  const { data, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    if (data?.result) {
      setUser(data.result);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (error?.response?.status === 401) {
      clearUser();
    }
  }, [error, clearUser]);

  return null;
}

export default UserInitializer;
