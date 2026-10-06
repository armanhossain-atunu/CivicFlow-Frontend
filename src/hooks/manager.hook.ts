"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignComplaint,
  getAllComplaints,
  getComplaint,
  getTechnicians,
} from "@/api/manager.api";
import {
  normalizeComplaintPayload,
  normalizeComplaints,
  normalizeTechnicians,
} from "@/types/manager.types";

const managerQueryKeys = {
  complaints: ["manager", "complaints"] as const,
  technicians: ["manager", "technicians"] as const,
  complaint: (complaintId: string | undefined) =>
    ["manager", "complaint", complaintId] as const,
};

export function useManagerComplaints() {
  return useQuery({
    queryKey: managerQueryKeys.complaints,
    queryFn: async () => normalizeComplaints(await getAllComplaints()),
    retry: false,
  });
}

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

export function useManagerTechnicians(enabled: boolean) {
  return useQuery({
    queryKey: managerQueryKeys.technicians,
    queryFn: async () => normalizeTechnicians(await getTechnicians()),
    enabled,
    retry: false,
  });
}

export function useAssignComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      complaintId,
      userId,
    }: {
      complaintId: string;
      userId: string;
    }) => assignComplaint(complaintId, userId),
    onSuccess: async (_result, { complaintId }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: managerQueryKeys.complaints,
        }),
        queryClient.invalidateQueries({
          queryKey: managerQueryKeys.complaint(complaintId),
        }),
      ]);
    },
  });
}
