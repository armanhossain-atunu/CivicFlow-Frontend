// pay for complaint
export type CreateComplaintPaymentResponse = {
  data?: {
    bkashURL?: string;
    bkashUrl?: string;
    paymentURL?: string;
    paymentUrl?: string;
  };
  bkashURL?: string;
  bkashUrl?: string;
  paymentURL?: string;
  paymentUrl?: string;
};
export type Payment = {
  id: string;

  complaintId?: string;
  citizenId?: string;

  amount?: number;

  status?: string;
  method?: string;
  purpose?: string;

  transactionId?: string;
  gatewayTransactionId?: string;
  merchantInvoice?: string;
  gateway?: string;

  initiatedAt?: string;
  paidAt?: string;
  failedAt?: string | null;

  failureReason?: string | null;

  createdAt?: string;
  updatedAt?: string;

  complaint?: {
    id?: string;
    title?: string;
  };
};

export type PaymentHistoryProps = {
  payments: Payment[];
  isLoading: boolean;
  isError: boolean;
};
