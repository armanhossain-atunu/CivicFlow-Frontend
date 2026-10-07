import { useQuery } from "@tanstack/react-query";
import { getMyAssignments } from "@/api/technician.api";

export function useGetMyAssignments() {
  return useQuery({
    queryKey: ["my-assignments"],
    queryFn: getMyAssignments,
  });
}
