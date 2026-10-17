/** biome-ignore-all assist/source/organizeImports: <explanation> */
import {
  createComplaint,
  createFeedback,
  deleteComplaint,
  getAllCategories,
  getAllComplaints,
  getComplaint,
  getFeedbacks,
  getMyAllComplaints,
  payForComplaint,
} from "@/api/complaint.api";
import { closeComplaint } from "@/api/manager.api";
import type {
  CreateFeedbackPayload,
  GetAllComplaintsParams,
} from "@/types/complaints.type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// create complainth
// Create complaint
export function useCreateComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComplaint,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["my-complaints"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["complaints"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["pending-complaints"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["pending-payments"],
        }),
      ]);
    },
  });
}

// get all categories
export function useGetAllCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    retry: false,
  });
}
// payment for complaint
export function usePayForComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (complaintId: string) => payForComplaint(complaintId),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["my-payments-history"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["complaints"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["own-complaints"],
        }),
        queryClient.invalidateQueries({ queryKey: ["pending-payments"] }),
      ]);
    },
  });
}

export type ComplaintStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";

export type MyComplaintsQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: ComplaintStatus;
};

export function useGetMyAllComplaints(params: MyComplaintsQuery) {
  return useQuery({
    queryKey: ["my-complaints", params],
    queryFn: () => getMyAllComplaints(params),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
}
// get all complaints
export function useGetAllComplaints(params: GetAllComplaintsParams = {}) {
  return useQuery({
    queryKey: [
      "complaints",
      params.page ?? 1,
      params.limit ?? 10,
      params.search ?? "",
      params.status ?? "",
      params.sortBy ?? "createdAt",
      params.sortOrder ?? "desc",
    ],

    queryFn: () =>
      getAllComplaints({
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search,
        status: params.status,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      }),

    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

const COMPLAINT_STATISTICS_PAGE_SIZE = 100;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getComplaintRecords(value: unknown) {
  let current = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) {
      return current.filter(
        (item): item is Record<string, unknown> =>
          isRecord(item) && typeof item.id === "string",
      );
    }

    if (!isRecord(current) || !("data" in current)) {
      return [];
    }

    current = current.data;
  }

  return [];
}

export function useGetComplaintStatistics() {
  return useQuery({
    queryKey: ["complaints", "statistics"],
    queryFn: async () => {
      const complaintsById = new Map<string, { id: string; status?: string }>();

      for (let page = 1; ; page += 1) {
        const response = await getAllComplaints({
          page,
          limit: COMPLAINT_STATISTICS_PAGE_SIZE,
        });
        const complaints = getComplaintRecords(response);
        const previousCount = complaintsById.size;

        for (const complaint of complaints) {
          if (typeof complaint.id !== "string") {
            continue;
          }

          const id = complaint.id;
          const status =
            typeof complaint.status === "string" ? complaint.status : undefined;

          complaintsById.set(id, { id, status });
        }

        if (
          complaints.length < COMPLAINT_STATISTICS_PAGE_SIZE ||
          complaintsById.size === previousCount
        ) {
          break;
        }
      }

      const uniqueComplaints = Array.from(complaintsById.values());

      return {
        totalComplaints: uniqueComplaints.length,
        resolvedComplaints: uniqueComplaints.filter(
          (complaint) => complaint.status?.toUpperCase() === "RESOLVED",
        ).length,
        activeRequests: uniqueComplaints.filter((complaint) =>
          ["SUBMITTED", "ASSIGNED", "IN_PROGRESS"].includes(
            complaint.status?.toUpperCase() ?? "",
          ),
        ).length,
      };
    },
    retry: false,
  });
}

// get single complaint
export function useGetSingleComplaint(complaintId: string) {
  return useQuery({
    queryKey: ["complaint", complaintId],
    queryFn: () => getComplaint(complaintId),
    enabled: Boolean(complaintId),
  });
}

// Delete complaint
export function useDeleteComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComplaint,
    onSuccess: async (_data, complaintId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-complaints"] }),
        queryClient.invalidateQueries({ queryKey: ["complaints"] }),
        queryClient.invalidateQueries({ queryKey: ["pending-payments"] }),
        queryClient.invalidateQueries({ queryKey: ["complaint", complaintId] }),
      ]);
    },
  });
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFeedbackPayload) => createFeedback(payload),
    onSuccess: async (_data, payload) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-complaints"] }),
        queryClient.invalidateQueries({
          queryKey: ["complaint", payload.complaintId],
        }),
      ]);
    },
  });
}
// get all feedback
export function useGetFeedbacks() {
  return useQuery({
    queryKey: ["feedbacks"],
    queryFn: getFeedbacks,
    retry: false,
  });
}

// get my all pending payments for complaint

// Get all pending complaints for the current user
export function useGetAllPendingComplaints(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["pending-complaints", page, limit],
    queryFn: () => getMyAllComplaints({ page, limit }),
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
// close complaint

export function useCloseComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (complaintId: string) => closeComplaint(complaintId),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["complaints"],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: ["my-complaints"],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: ["assignments"],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: ["my-assignments"],
          refetchType: "active",
        }),
      ]);
    },
  });
}
