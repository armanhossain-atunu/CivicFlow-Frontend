/** biome-ignore-all lint/correctness/noUnusedImports: <explanation> */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignmentCreate,
  getAllComplaints,
  getComplaint,
  getTechnicians,
} from "@/api/manager.api";
import {
  createAssignment,
  normalizeComplaintPayload,
  normalizeComplaints,
} from "@/types/manager.types";

const managerQueryKeys = {
  complaints: ["manager", "complaints"] as const,
  technicians: ["manager", "technicians"] as const,
  complaint: (complaintId: string | undefined) =>
    ["manager", "complaint", complaintId] as const,
};
// get all complaints
export function useManagerComplaints() {
  return useQuery({
    queryKey: managerQueryKeys.complaints,
    queryFn: async () => normalizeComplaints(await getAllComplaints()),
    retry: false,
  });
}
// get a single complaint
export function useManagerComplaint(complaintId: string | undefined) {
  return useQuery({
    queryKey: managerQueryKeys.complaint(complaintId),
    queryFn: async () => {
      if (!complaintId) {
        throw new Error("Select a complaint to view its details.");
      }

      return normalizeComplaintPayload(await getComplaint(complaintId));
    },
    enabled: Boolean(complaintId),
    retry: false,
  });
}
// get all technicians
export function useGetTechnicians() {
  return useQuery({
    queryKey: ["technicians"],
    queryFn: getTechnicians,
  });
}
// assign a technician to a complaint
export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: createAssignment) => assignmentCreate(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: managerQueryKeys.complaints,
      });
    },
  });
}
