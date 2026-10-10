/** biome-ignore-all lint/style/useImportType: <explanation> */
import apiClient from "@/lib/apiClient";
import { createAssignment } from "@/types/manager.types";
import type { GetAllComplaintsParams } from "@/types/complaints.type";

import { IUserListResponse } from "@/types/user.type";
// get all complaints
export function getAllComplaints(
  params: Pick<GetAllComplaintsParams, "page" | "limit"> = {},
) {
  const searchParams = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });

  return apiClient<unknown>(`/complaint?${searchParams.toString()}`, {
    method: "GET",
  });
}
// get complaint by id
export function getComplaint(complaintId: string) {
  return apiClient<unknown>(`/complaint/${encodeURIComponent(complaintId)}`, {
    method: "GET",
  });
}
// get all technicians
export function getTechnicians() {
  return apiClient<IUserListResponse>("/user", {
    method: "GET",
  });
}

// assign complaint to a technician
export function assignmentCreate(payload: createAssignment) {
  return apiClient("/complaint-assignments", {
    method: "POST",
   body: payload,
  });
}
// 
export function closeComplaint(complaintId: string) {
  return apiClient(
    `/complaint-assignments/${encodeURIComponent(complaintId)}/close`,
    {
      method: "PATCH",
    },
  );
}