import apiClient from "@/lib/apiClient";

export function getAllComplaints() {
  return apiClient<unknown>("/complaint", {
    method: "GET",
  });
}

export function getComplaint(complaintId: string) {
  return apiClient<unknown>(`/complaint/${encodeURIComponent(complaintId)}`, {
    method: "GET",
  });
}

export function getTechnicians() {
  return apiClient<unknown>("/technicians", {
    method: "GET",
  });
}

// assign complaint to a technician
export function assignComplaint(complaintId: string, userId: string) {
  return apiClient("/complaint-assignments", {
    method: "POST",
    body: { complaintId, assignedToId: userId },
  });
}
