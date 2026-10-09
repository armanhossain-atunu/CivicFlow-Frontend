/** biome-ignore-all lint/style/useImportType: <explanation> */
import apiClient from "@/lib/apiClient";
import { createAssignment } from "@/types/manager.types";

import { IUserListResponse } from "@/types/user.type";
// get all complaints
export function getAllComplaints() {
  return apiClient<unknown>("/complaint", {
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