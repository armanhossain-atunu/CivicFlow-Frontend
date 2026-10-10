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
  normalizeComplaintPage,
  normalizeComplaintPayload,
} from "@/types/manager.types";
import type { createAssignment } from "@/types/manager.types";
// query keys
const managerQueryKeys = {
  complaints: ["manager", "complaints"] as const,
  technicians: ["manager", "technicians"] as const,
  complaint: (complaintId: string | undefined) =>
    ["manager", "complaint", complaintId] as const,
};
// get all complaints
// useManagerComplaints
export function useManagerComplaints(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...managerQueryKeys.complaints, page, limit],
    queryFn: async () =>
      normalizeComplaintPage(
        await getAllComplaints({ page, limit }),
        page,
        limit,
      ),
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
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
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
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
    onSuccess: async () => {
      // Refresh complaint lists and dashboard data.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: managerQueryKeys.complaints,
        }),
        queryClient.invalidateQueries({
          queryKey: ["complaints"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["my-complaints"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["assignments"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["technicians"],
        }),
      ]);
    },
  });
}
