import apiClient from "@/lib/apiClient";

export function getMyAssignments() {
return apiClient("/complaint-assignments/my-assignments", { method: "GET" });

}