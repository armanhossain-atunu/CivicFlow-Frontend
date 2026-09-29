const helpTopics = [
  {
    question: "How do I submit a service request?",
    answer:
      "Use the CivicFlow reporting flow to describe the issue, attach a location, and select the relevant service category.",
  },
  {
    question: "Can I track progress after submission?",
    answer:
      "Yes. Citizens can monitor each request from review and assignment through technician updates and final resolution.",
  },
  {
    question: "Who can access my request details?",
    answer:
      "Only the assigned team members and authorized city staff relevant to the issue can access the request records.",
  },
];

const HelpPage = () => {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Help center
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Support for residents and city teams
        </h1>
      </section>

      <section className="mt-12 space-y-5">
        {helpTopics.map((item) => (
          <div
            key={item.question}
            className="rounded-2xl border bg-slate-50 p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              {item.question}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {item.answer}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default HelpPage;
