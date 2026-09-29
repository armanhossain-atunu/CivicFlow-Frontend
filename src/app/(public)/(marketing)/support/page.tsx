const supportSteps = [
  "Describe the issue, location, and urgency clearly.",
  "Select the correct city service category so requests are routed efficiently.",
  "Monitor updates from the assigned team until the issue is resolved.",
];

const SupportPage = () => {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-3xl border bg-slate-50 p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Support
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          We’re here to help move requests forward
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          CivicFlow support helps residents and internal teams resolve civic
          issues quickly and transparently.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {supportSteps.map((step, index) => (
            <div key={step} className="rounded-2xl border bg-white p-5">
              <p className="text-sm font-semibold text-primary">0{index + 1}</p>
              <p className="mt-3 text-base leading-7 text-slate-700">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default SupportPage;
