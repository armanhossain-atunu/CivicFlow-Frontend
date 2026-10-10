
import { useQuery } from "@tanstack/react-query";
import { getAllPayments, getMyPaymentsHistory } from "@/api/payment.api";

export function useMyPaymentsHistory() {
  return useQuery({
    queryKey: ["my-payments-history"],
    queryFn: getMyPaymentsHistory,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
   
  });
}

export function useGetPayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: getAllPayments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}