import apiClient from "@/lib/apiClient";
// register
export function registerUser(payload: {
  name: string;
  contactNumber?: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  return apiClient("/auth/register", { method: "POST", body: payload });
}
// login
export function userLogin(payload: { email: string; password: string }) {
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
export function verifyEmail(payload: { email: string; otp: string }) {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
}
// forget-password
export function forgotPassword(payload: { email: string }) {
  return apiClient("/auth/forget-password", { method: "POST", body: payload });
}

// reset password
export function resetPassword(payload: {
  email: string;
  otp: string;
  newPassword: string;
}) {
  return apiClient("/auth/reset-password", { method: "POST", body: payload });
}

// logout
export function logout() {
  return apiClient("/auth/logout", { method: "POST" });
}
//google login
export function googleOAuth(payload: { idToken: string }) {
  return apiClient("/auth/google", { method: "POST", body: payload });
}
