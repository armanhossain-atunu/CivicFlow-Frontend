import apiClient from "@/lib/apiClient";

export function getAllPendingPayments() {
  return apiClient("/complaint/my", { method: "GET" });
}

// get my payments history
export function getMyPaymentsHistory() {
  return apiClient("/payments/my-payments", { method: "GET" });
}
