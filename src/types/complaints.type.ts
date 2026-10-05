export type Complaint = {
  id: string;
  title?: string;
  status?: string;
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
