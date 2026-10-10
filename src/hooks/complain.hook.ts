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
        queryClient.invalidateQueries({ queryKey: ["pending-payments"], }),
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

export function useGetFeedbacks() {
  return useQuery({
    queryKey: ["feedbacks"],
    queryFn: getFeedbacks,
    retry: false,
  });
}

// get my all pending payments for complaint

// Get all pending complaints for the current user
export function useGetAllPendingComplaints(
  page = 1,
  limit = 10,
) {
  return useQuery({
    queryKey: ["pending-complaints", page, limit],
    queryFn: () => getMyAllComplaints({ page, limit }),
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCloseComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (complaintId: string) =>
      closeComplaint(complaintId),

    onSuccess: async () => {
      await Promise.all([
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
          queryKey: ["my-assignments"],
        }),
      ]);
    },
  });
}