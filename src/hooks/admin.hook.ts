import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  closeAdminAssignment,
  createAdminAssignment,
  createAdminCategory,
  deleteAdminUser,
  getAdminCategories,
  getAdminUsers,
  updateAdminCategory,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "@/api/admin.api";
import type {
  AdminAssignmentPayload,
  AdminCategoryPayload,
} from "@/types/admin.type";
import type { UserRole, UserStatus } from "@/types/user.type";

const adminQueryKeys = {
  users: ["admin", "users"] as const,
  categories: ["admin", "categories"] as const,
  assignments: ["admin", "assignments"] as const,
};

export function useAdminUsers() {
  return useQuery({
    queryKey: adminQueryKeys.users,
    queryFn: getAdminUsers,
    retry: false,
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteAdminUser(userId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.users }),
        queryClient.invalidateQueries({ queryKey: ["technicians"] }),
      ]);
    },
  });
}

export function useUpdateAdminUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      updateAdminUserRole(userId, role),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.users }),
        queryClient.invalidateQueries({ queryKey: ["technicians"] }),
      ]);
    },
  });
}

export function useUpdateAdminUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      updateAdminUserStatus(userId, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminQueryKeys.users });
    },
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: adminQueryKeys.categories,
    queryFn: getAdminCategories,
    retry: false,
  });
}

export function useCreateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminCategoryPayload) =>
      createAdminCategory(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories }),
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
      ]);
    },
  });
}

export function useUpdateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: string;
      payload: Partial<AdminCategoryPayload>;
    }) => updateAdminCategory(categoryId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories }),
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
      ]);
    },
  });
}

export function useCreateAdminAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminAssignmentPayload) =>
      createAdminAssignment(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.assignments }),
        queryClient.invalidateQueries({ queryKey: ["manager", "complaints"] }),
        queryClient.invalidateQueries({ queryKey: ["complaints"] }),
        queryClient.invalidateQueries({ queryKey: ["assignments"] }),
        queryClient.invalidateQueries({ queryKey: ["my-assignments"] }),
      ]);
    },
  });
}

export function useCloseAdminAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeAdminAssignment,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.assignments }),
        queryClient.invalidateQueries({ queryKey: ["manager", "complaints"] }),
        queryClient.invalidateQueries({ queryKey: ["complaints"] }),
        queryClient.invalidateQueries({ queryKey: ["assignments"] }),
        queryClient.invalidateQueries({ queryKey: ["my-assignments"] }),
      ]);
    },
  });
}