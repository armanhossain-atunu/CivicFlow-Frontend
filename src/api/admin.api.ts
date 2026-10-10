import apiClient from "@/lib/apiClient";
import type {
  AdminAssignmentPayload,
  AdminCategoryPayload,
  AdminUsersResponse,
} from "@/types/admin.type";

export function getAdminUsers() {
  return apiClient<AdminUsersResponse>("/user", { method: "GET" });
}

export function getAdminCategories() {
  return apiClient<unknown>("/categories", { method: "GET" });
}

export function createAdminCategory(payload: AdminCategoryPayload) {
  return apiClient("/categories", { method: "POST", body: payload });
}

export function updateAdminCategory(
  categoryId: string,
  payload: Partial<AdminCategoryPayload>,
) {
  return apiClient(`/categories/${encodeURIComponent(categoryId)}`, {
    method: "PATCH",
    body: payload,
  });
}

export function createAdminAssignment(payload: AdminAssignmentPayload) {
  return apiClient("/complaint-assignments", {
    method: "POST",
    body: payload,
  });
}

export function closeAdminAssignment(complaintId: string) {
  return apiClient(
    `/complaint-assignments/${encodeURIComponent(complaintId)}/close`,
    { method: "PATCH" },
  );
}