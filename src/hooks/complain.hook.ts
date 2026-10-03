/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { createComplaint, getAllCategories } from "@/api/complaint.api";
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