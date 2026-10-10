import GetAllPayments from "@/components/common/getAllPayments";
import { AdminPage } from "../AdminPage";

export default function AdminPaymentsPage() {
  return (
    <AdminPage
      title="Payments"
      description="Search payment records and review transaction statuses."
    >
      <GetAllPayments />
    </AdminPage>
  );
}
