import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, updateUser, updatePassword, deleteUser } from "../../api/users";
import { showToast } from "../../lib/toast";

export function useFetchUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUsers(),
    onError: (error) => {
      console.error("Error fetching user:", error);
      showToast("사용자 정보를 불러오지 못했습니다.", { type: "error" });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, profileImage }) => updateUser(payload, profileImage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      showToast("정보가 수정되었습니다.", { type: "info" });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      showToast("정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.", { type: "error" });
    },
  });
}

export function useUpdatePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => updatePassword(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      showToast("비밀번호가 변경되었습니다.", { type: "info" });
    },
    onError: () => {
      showToast("비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.", { type: "error" });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      showToast("회원 탈퇴가 완료되었습니다.", { type: "info" });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      showToast("회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.", { type: "error" });
    },
  });
}
