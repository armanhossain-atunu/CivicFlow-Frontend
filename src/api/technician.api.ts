import apiClient from "@/lib/apiClient";
// get my Assignments
export function getMyAssignments() {
return apiClient("/complaint-assignments/my-assignments", { method: "GET" });

}

export function updateStatus(
  assignmentId: string,
  status: "IN_PROGRESS"|"RESOLVED",
) {
  return apiClient(
    `/complaint-assignments/${assignmentId}/complete`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
    },
  );
}