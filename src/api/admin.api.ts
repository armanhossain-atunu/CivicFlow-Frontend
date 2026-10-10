import apiClient from "@/lib/apiClient";
import type {
  AdminAssignmentPayload,
  AdminCategoryPayload,
  AdminUsersResponse,
} from "@/types/admin.type";
import type { UserRole, UserStatus } from "@/types/user.type";

export function getAdminUsers() {
  return apiClient<AdminUsersResponse>("/user", { method: "GET" });
}

export function deleteAdminUser(userId: string) {
  return apiClient(`/user/${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}

export function updateAdminUserRole(userId: string, role: UserRole) {
  return apiClient(`/user/${encodeURIComponent(userId)}/role`, {
    method: "PATCH",
    body: { role },
  });
}

export function updateAdminUserStatus(userId: string, status: UserStatus) {
  return apiClient(`/user/${encodeURIComponent(userId)}/status`, {
    method: "PATCH",
    body: { status },
  });
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