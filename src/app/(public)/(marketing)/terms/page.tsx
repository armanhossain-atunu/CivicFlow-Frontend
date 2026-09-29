const termSections = [
  {
    title: "Use of the platform",
    description:
      "CivicFlow is intended for lawful civic engagement, service reporting, and operational coordination between residents and city teams.",
  },
  {
    title: "Account responsibility",
    description:
      "Users are responsible for the accuracy of the information they provide and the proper use of their account credentials.",
  },
  {
    title: "Service communication",
    description:
      "CivicFlow may send updates related to status changes, assignments, or service outcomes through the platform or associated channels.",
  },
];

const TermsPage = () => {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-3xl border bg-slate-50 p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Terms
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          CivicFlow terms and conditions
        </h1>
        <p className="mt-6 text-lg text-slate-600">
          These terms explain how CivicFlow is used to support communication
          between residents, public organizations, and city service teams.
        </p>

        <div className="mt-10 space-y-6">
          {termSections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border bg-white p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {section.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default TermsPage;
