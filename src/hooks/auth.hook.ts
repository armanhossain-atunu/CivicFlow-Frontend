import { useMutation, useQuery } from "@tanstack/react-query";
import { getme, googleOAuth, logout, updateProfile, userLogin } from "@/api";
// login
export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}
// google login
export function useGoogleOAuth(){
return useMutation({
    mutationFn: googleOAuth,
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
// update profile
export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
  });
}