import type { IUserListResponse } from "@/types/user.type";

export interface ICreateCategory {
  name: string;
  description?: string;
  department: string;
  isActive?: boolean;
  paymentRequired?: boolean;
  paymentAmount?: number;
}

export type AdminCategory = {
  id: string;
  name: string;
  description?: string;
  department?: string;
  isActive?: boolean;
  paymentRequired?: boolean;
  paymentAmount?: number | null;
};

export type AdminCategoryPayload = {
  name: string;
  description: string;
  department: string;
  isActive: boolean;
  paymentRequired: boolean;
  paymentAmount?: number;
};

export type AdminAssignmentPayload = {
  complaintId: string;
  assignedToId: string;
  note?: string;
};

export type AdminUsersResponse = IUserListResponse;
