import { useMutation, useQuery } from "@tanstack/react-query";
import {
  forgotPassword,
  getme,
  googleOAuth,
  logout,
  registerUser,
  resetPassword,
  updateProfile,
  userLogin,
  verifyEmail,
} from "@/api";
// register
export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}

// login
export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}
// google login
export function useGoogleOAuth() {
  return useMutation({
    mutationFn: googleOAuth,
  });
}

// get current user

export function useGetme(enabled = true) {
  return useQuery({
    queryKey: ["user"],
    queryFn: getme,
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
// update profile
export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
  });
}
// user email verification
export function useVerifyEmail() {
  return useMutation({
    mutationFn: verifyEmail,
  });
}
// forget-password
export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

// reset password
export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

// logout
export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}
