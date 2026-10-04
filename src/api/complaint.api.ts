/** biome-ignore-all lint/style/useImportType: <explanation> */
import apiClient from "@/lib/apiClient";
import { ICreateComplaint } from "@/types/auth.type";
import { CreateComplaintPaymentResponse } from "@/types/payment.type";

// create complaint
export function createComplaint(payload: ICreateComplaint) {
  return apiClient("/complaint", { method: "POST", body: payload });
}

// get all categories
export function getAllCategories() {
  return apiClient("/categories", { method: "GET" });
}

export function payForComplaint(complaintId: string) {
  return apiClient<CreateComplaintPaymentResponse>(
    `/payments/complaint/${encodeURIComponent(complaintId)}/bkash/create`,
    {
      method: "POST",
    },
  );
}

// get my all complaints
export function getAllComplaints() {
  return apiClient("/complaint/my", { method: "GET" });
}