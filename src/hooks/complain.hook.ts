
import { createComplaint } from "@/api/complaint.api";
import { useMutation } from "@tanstack/react-query";

// create complaint
export function useCreateComplaint() {
    return useMutation({
        mutationFn: createComplaint,
    });
}