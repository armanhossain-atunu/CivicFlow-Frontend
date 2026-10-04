/** biome-ignore-all assist/source/organizeImports: <explanation> */
import {
  createComplaint,
  getAllCategories,
  getAllComplaints,
  payForComplaint,
} from "@/api/complaint.api";
import { useMutation, useQuery } from "@tanstack/react-query";

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
// pay for complaint
export function usePayForComplaint() {
  return useMutation({
    mutationFn: payForComplaint,
  });
}
// get all pending payments for complaint 
export function useGetAllPendingComplaints() {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: getAllComplaints,
    retry: false,
  });
}