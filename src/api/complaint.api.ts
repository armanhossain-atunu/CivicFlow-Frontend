/** biome-ignore-all lint/style/useImportType: <explanation> */
import { MyComplaintsQuery } from "@/hooks/complain.hook";
import apiClient from "@/lib/apiClient";
import { ICreateComplaint } from "@/types/auth.type";
import {
  CreateFeedbackPayload,
  FeedbackListResponse,
  GetAllComplaintsParams,
  GetAllComplaintsResponse,
} from "@/types/complaints.type";
import { CreateComplaintPaymentResponse } from "@/types/payment.type";

export type CategoryPayload = {
  name: string;
  department: string;
  paymentRequired: boolean;
  paymentAmount?: number | null;
};

// create complaint
export function createComplaint(payload: ICreateComplaint) {
  return apiClient("/complaint", { method: "POST", body: payload });
}

// get all categories
export function getAllCategories() {
  return apiClient("/categories", { method: "GET" });
}

// create category
export function createCategory(payload: CategoryPayload) {
  return apiClient("/categories", { method: "POST", body: payload });
}

// update category
export function updateCategory(
  categoryId: string,
  payload: Partial<CategoryPayload>,
) {
  return apiClient(`/categories/${encodeURIComponent(categoryId)}`, {
    method: "PATCH",
    body: payload,
  });
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
export function getAllComplaints(params: GetAllComplaintsParams = {}) {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? 10));

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.sortBy) {
    searchParams.set("sortBy", params.sortBy);
  }

  if (params.sortOrder) {
    searchParams.set("sortOrder", params.sortOrder);
  }

  return apiClient<GetAllComplaintsResponse>(
    `/complaint?${searchParams.toString()}`,
    {
      method: "GET",
    },
  );
}
// get my all complaints

export function getMyAllComplaints(params: MyComplaintsQuery) {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page));
  searchParams.set("limit", String(params.limit));

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  return apiClient<unknown>(`/complaint/my?${searchParams.toString()}`, {
    method: "GET",
  });
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

export function createFeedback(payload: CreateFeedbackPayload) {
  return apiClient("/feedbacks", {
    method: "POST",
    body: payload,
  });
}
// get all feedbacks
export async  function getFeedbacks() {
  const res = await apiClient< FeedbackListResponse>("/feedbacks", { method: "GET" });
  console.log(res,"api res")
  return apiClient<FeedbackListResponse>("/feedbacks", {
    method: "GET",
  });
}
