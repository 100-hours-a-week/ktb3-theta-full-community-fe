import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, logout } from "../../api/auth";
import { fetchUsers } from "../../api/users";
import { useUser } from "../../contexts/useUser";
import { showToast } from "../../lib/toast";

export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser } = useUser();

  return useMutation({
    mutationFn: (payload) => login(payload),
    onSuccess: async () => {
      const user = await fetchUsers();
      setUser(user?.result);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      showToast("로그인되었습니다.", { type: "info" });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { clearUser } = useUser();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      showToast("로그아웃되었습니다.", { type: "info" });
    },
    onError: () => {
      showToast("로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.", { type: "error" });
    },
  });
}
