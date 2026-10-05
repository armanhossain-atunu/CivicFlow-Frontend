import Link from "next/link";

type Payment = {
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

type PaymentHistoryProps = {
  payments: Payment[];
  isLoading: boolean;
  isError: boolean;
};

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-BD", {
        dateStyle: "medium",
      }).format(date);
}

export default function PaymentHistory({
  payments,
  isLoading,
  isError,
}: PaymentHistoryProps) {
  return (
    <section id="payment-history" className="scroll-mt-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Payment history</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your latest payment transactions.
          </p>
        </div>
        <Link
          href="/payment-pending"
          className="text-sm font-medium text-primary hover:underline"
        >
          Pending payments
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border bg-card">
        {isLoading ? (
          <p className="p-5 text-sm text-muted-foreground">
            Loading payment history...
          </p>
        ) : isError ? (
          <p className="p-5 text-sm text-destructive">
            Unable to load payment history.
          </p>
        ) : payments.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">
            No payment history is available yet.
          </p>
        ) : (
          <div className="divide-y">
            {payments.map((payment) => (
              <article
                key={payment.id}
                className="flex flex-wrap items-center justify-between gap-3 p-5"
              >
                <div>
                  <h3 className="font-medium">
                    {payment.complaint?.title ||
                      payment.paymentID ||
                      payment.transactionId ||
                      payment.id}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {(payment.amount ?? payment.paymentAmount) !== undefined && (
                    <span className="font-semibold">
                      ৳{payment.amount ?? payment.paymentAmount}
                    </span>
                  )}
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {payment.paymentStatus || payment.status || "Recorded"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
