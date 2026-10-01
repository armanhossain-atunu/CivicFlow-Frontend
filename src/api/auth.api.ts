import apiClient from "@/lib/apiClient";
// login
export function userLogin(payload: { email: string; password: string }) {
  return apiClient ( "/auth/login",{  method: "POST",  body: payload });
}
// get current user
export function getme() {
  return apiClient ( "/auth/me", { method: "GET" });
}
// logout
export function logout() {
  return apiClient ( "/auth/logout", { method: "POST" });
}
// register
