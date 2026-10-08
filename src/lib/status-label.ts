export const STATUS_LABELS: Record<string, string> = {
  PAYMENT_PENDING: "Payment Pending",
  SUBMITTED: "Submitted",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  REJECTED: "Rejected",
};

export function getStatusLabel(status?: string) {
  if (!status) return "Unknown";

  return (
    STATUS_LABELS[status] ??
    status
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}