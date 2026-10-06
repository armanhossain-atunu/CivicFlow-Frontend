import ComplaintDetails from "./ComplaintDetails";

export default async function CitizenComplaintDetailsPage({
  params,
}: {
  params: Promise<{ complaintId: string }>;
}) {
  const { complaintId } = await params;

  return <ComplaintDetails complaintId={complaintId} />;
}
