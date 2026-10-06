import { ComplaintForm } from "@/components/Form/ComplaintForm";

const ComplaintPage = () => {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Complaint center
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Report city issues quickly and clearly
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            Submit a public service request so the relevant department can
            assess, assign, and resolve it without delays.
          </p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <p className="font-medium text-slate-900">What to include</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>The service issue or incident description</li>
              <li>Specific location details or nearby landmarks</li>
              <li>Relevant urgency, timeline, and department</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <ComplaintForm />
        </div>
      </section>
    </main>
  );
};

export default ComplaintPage;
