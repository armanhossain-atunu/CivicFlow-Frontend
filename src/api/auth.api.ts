/** biome-ignore-all lint/style/useImportType: <explanation> */
import apiClient from "@/lib/apiClient";
import { ForgotPasswordPayload, GooglePayload, LoginPayload, RegisterPayload, ResetPasswordPayload, VerifyEmailPayload } from "@/types/auth.type";

// register
export function registerUser(payload: RegisterPayload ) {
  return apiClient("/auth/register", { method: "POST", body: payload });
}
// login
export function userLogin(payload: LoginPayload) {
  return apiClient("/auth/login", { method: "POST", body: payload });
}
// get current user
export function getme() {
  return apiClient("/auth/me", { method: "GET" });
}
// profile update
export function updateProfile(profileImage: File) {
  return apiClient("/user/profile-image", {
    method: "PATCH",
    body: profileImage,
  });
}
//user email verification
export function verifyEmail(payload: VerifyEmailPayload) {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
}
// forget-password
export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient("/auth/forget-password", { method: "POST", body: payload });
}

// reset password
export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient("/auth/reset-password", { method: "POST", body: payload });
}

// logout
export function logout() {
  return apiClient("/auth/logout", { method: "POST" });
}
//google login
export function googleOAuth(payload: GooglePayload) {
  return apiClient("/auth/google", { method: "POST", body: payload });
}
