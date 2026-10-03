/** biome-ignore-all lint/style/useImportType: <explanation> */
import apiClient from "@/lib/apiClient";
import { ICreateComplaint } from "@/types/auth.type";

// create complaint
export function createComplaint(payload: ICreateComplaint) {
  return apiClient("/complaint", { method: "POST", body: payload });
}

// get all categories
export function getAllCategories() {
  return apiClient("/categories", { method: "GET" });
}