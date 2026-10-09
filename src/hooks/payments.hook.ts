
import { useQuery } from "@tanstack/react-query";
import { getMyPaymentsHistory } from "@/api/payment.api";

export function useMyPaymentsHistory() {
  return useQuery({
    queryKey: ["my-payments-history"],
    queryFn: getMyPaymentsHistory,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
   
  });
}

