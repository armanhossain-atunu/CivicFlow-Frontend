import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyAssignments, updateStatus } from "@/api/technician.api";

export function useGetMyAssignments() {
  return useQuery({
    queryKey: ["my-assignments"],
    queryFn: getMyAssignments,
  });
}
export function useUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assignmentId,
      status,
    }: {
      assignmentId: string;
      status: "IN_PROGRESS" | "RESOLVED";
    }) => updateStatus(assignmentId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-assignments"],
      });
    },
  });
}