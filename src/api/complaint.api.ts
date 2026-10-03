/** biome-ignore-all lint/style/useImportType: <explanation> */
import apiClient from "@/lib/apiClient";
import { ICreateComplaint } from "@/types/auth.type";

// create complaint
export function createComplaint(payload: ICreateComplaint) {
  return apiClient("/complaint", { method: "POST", body: payload });
}

// get all categories
export function getAllCategories() {
  return apiClient("/categories", { method: "GET" });
}
// pay for complaint
export type CreateComplaintPaymentResponse = {
  data?: {
    bkashURL?: string;
    bkashUrl?: string;
    paymentURL?: string;
    paymentUrl?: string;
  };
  bkashURL?: string;
  bkashUrl?: string;
  paymentURL?: string;
  paymentUrl?: string;
};

export function payForComplaint(complaintId: string) {
  return apiClient<CreateComplaintPaymentResponse>(
    `/payments/complaint/${encodeURIComponent(complaintId)}/bkash/create`,
    {
      method: "POST",
    },
  );
}

// get all complaints
export function getAllComplaints() {
  return apiClient("/complaints", { method: "GET" });
}