import apiClient from "@/lib/apiClient";
import { ICreateComplaint } from "@/types/auth.type";


export function createComplaint(payload: ICreateComplaint) {
  return apiClient("/complaint", { method: "POST", body: payload });
}