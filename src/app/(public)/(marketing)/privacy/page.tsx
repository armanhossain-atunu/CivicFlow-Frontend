const privacyPoints = [
  "We collect only the information needed to process civic service requests and improve service delivery.",
  "Request details are limited to the staff or agencies assigned to the relevant issue.",
  "We use secure systems to protect resident information and activity history.",
  "Users can contact our team to ask questions about the use and handling of their data.",
];

const PrivacyPage = () => {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-3xl border bg-slate-50 p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Privacy
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          CivicFlow privacy commitment
        </h1>
        <p className="mt-6 text-lg text-slate-600">
          We are committed to protecting the privacy of citizens, city staff,
          and service partners while enabling efficient public service support.
        </p>

        <ul className="mt-8 space-y-4 text-base leading-7 text-slate-700">
          {privacyPoints.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                ✓
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default PrivacyPage;
