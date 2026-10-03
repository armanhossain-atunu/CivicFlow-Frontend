import apiClient from "@/lib/apiClient";

export function getAllPendingPayments() {
  return apiClient("/complaint/my", { method: "GET" });
}
