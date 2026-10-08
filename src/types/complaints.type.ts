export type Complaint = {
  id: string;
  title?: string;
  status?: string;
  department?: string;
  location?: string;
  description?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  createdAt?: string;
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



export type MyComplaintsProps = {
  complaints: Complaint[];
  isLoading: boolean;
  isError: boolean;
  onDelete: (complaintId: string) => void;
  deletingComplaintId?: string | null;
};