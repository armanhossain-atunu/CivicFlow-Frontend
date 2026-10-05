/** biome-ignore-all assist/source/organizeImports: <explanation> */
import {
  createComplaint,
  deleteComplaint,
  getAllCategories,
  getAllComplaints,
  getComplaint,
  getMyAllComplaints,
  payForComplaint,
} from "@/api/complaint.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// create complaint
export function useCreateComplaint() {
  return useMutation({
    mutationFn: createComplaint,
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
  return useMutation({
    mutationFn: payForComplaint,
  });
}
// get my all complaints
export function useGetMyAllComplaints() {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: getMyAllComplaints,
    retry: false,
  });
}
// get all complaints
export function useGetAllComplaints() {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: getAllComplaints,
    retry: false,
  });
}

export function useGetSingleComplaint(complaintId: string) {
  return useQuery({
    queryKey: ["complaint", complaintId],
    queryFn: () => getComplaint(complaintId),
    enabled: Boolean(complaintId),
  });
}

export function useDeleteComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComplaint,
    onSuccess: (_data, complaintId) => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["complaints"] }),
        queryClient.invalidateQueries({
          queryKey: ["complaint", complaintId],
        }),
      ]);
    },
  });
}

// get my all pending payments for complaint
export function useGetAllPendingComplaints() {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: getMyAllComplaints,
    retry: false,
  });
}