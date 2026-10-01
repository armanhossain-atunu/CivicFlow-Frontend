import { useMutation, useQuery } from "@tanstack/react-query";
import { getme, logout, userLogin } from "@/api";
// login
export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}
// logout
export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}
// get current user
export function useGetme() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getme,
  });
}