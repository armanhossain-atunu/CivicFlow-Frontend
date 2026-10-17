export interface GetAllComplaintsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: "createdAt" | "title" | "status";
  sortOrder?: "asc" | "desc";
}

export interface GetAllComplaintsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Complaint[];
}

export type Complaint = {
  id: string;
  title?: string;
  description?: string;
  department?: string;
  category?: string;
  location?: string;
  status?: string;
  paymentAmount?: number;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
};
export type Payment = {
  id: string;
  paymentID?: string;
  transactionId?: string;
  amount?: number;
  paymentAmount?: number;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
  complaint?: { title?: string };
};
export type ComplaintDetailsData = {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  department?: string;
  category?: string;
  location?: string;
  createdAt?: string;
};

export type CreateFeedbackPayload = {
  rating: number;
  comment: string;
  complaintId: string;
};

export type FeedbackRecord = {
  id: string;
  rating: number;
  comment: string | null;
  complaintId: string;
  citizenId: string;
  createdAt?: string;
  updatedAt?: string;

  complaint?: {
    id: string;
    trackingId?: string;
    title?: string;
    status?: string;
    categoryName?: string;
    department?: string;
  } | null;

  citizen?: {
    id: string;
    name: string;
    email: string;
    imageUrl: string | null;
  } | null;
};

export type FeedbackListResponse = {
  success?: boolean;
  message?: string;
  data?: FeedbackRecord[];
  meta?: ComplaintPaginationMeta;
};

// ............
export type ComplaintPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

// Add these fields to your existing MyComplaintsProps:
export type MyComplaintsProps = {
  complaints: Complaint[];
  meta: ComplaintPaginationMeta;

  isLoading: boolean;
  isError: boolean;

  onDelete: (id: string) => void;
  deletingComplaintId?: string | null;

  // Search and filter
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;

  // Pagination
  onPageChange: (page: number) => void;
};
export type Category = {
  id: string;
  name: string;
  department: string;
  paymentRequired: boolean;
  paymentAmount?: number | null;
};

export type ComplaintFormValues = {
  title: string;
  description: string;
  categoryId: string;
  department: string;
  location: string;
};

export type CreateComplaintResponse = {
  data: {
    id: string;
  };
};
