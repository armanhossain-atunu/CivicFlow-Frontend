const featureList = [
  {
    title: "Citizen reporting",
    description:
      "Residents can submit service requests, track progress, and stay informed without navigating multiple departments.",
  },
  {
    title: "Smart assignment",
    description:
      "City staff can route requests to the right team using clear service categories and priority settings.",
  },
  {
    title: "Real-time updates",
    description:
      "Technicians and residents receive updates as work moves from review to completion.",
  },
  {
    title: "Performance visibility",
    description:
      "Managers can monitor resolution trends, backlog health, and service response quality in one view.",
  },
];

const FeaturesPage = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Features
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Built to simplify civic service delivery
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
          CivicFlow brings city teams and residents into a single workflow so
          public issues get handled faster, clearer, and with more
          accountability.
        </p>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {featureList.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border bg-slate-50 p-6 shadow-sm"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
              {feature.title.charAt(0)}
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              {feature.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {feature.description}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default FeaturesPage;
