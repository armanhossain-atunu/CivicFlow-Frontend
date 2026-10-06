export type UserRole = "CITIZEN" | "TECHNICIAN" | "MANAGER" | "ADMIN";

export type UserStatus = "ACTIVE" | "BLOCKED" | "SUSPENDED" | "DELETED";

export type AuthProvider = "CREDENTIAL" | "GOOGLE";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  authProvider: AuthProvider;
  emailVerified: boolean;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IUserListData {
  data: IUser[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface IUserListResponse {
  success: boolean;
  message: string;
  data: IUserListData;
}
