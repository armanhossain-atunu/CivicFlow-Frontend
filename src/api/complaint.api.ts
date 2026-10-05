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
// payment for complaint
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
  return apiClient(`/complaint`, {
    method: "GET",
  });
}

// get my all complaints
export function getMyAllComplaints() {
  return apiClient("/complaint/my", { method: "GET" });
}
// get complaint by id
export function getComplaint(complaintId: string) {
  return apiClient(`/complaint/${encodeURIComponent(complaintId)}`, {
    method: "GET",
  });
}

// delete a complaint (the API authorizes admins and the complaint owner)
export function deleteComplaint(complaintId: string) {
  return apiClient(`/complaint/${encodeURIComponent(complaintId)}`, {
    method: "DELETE",
  });
}
