const HomePage = () => {
  // const {data:complaine}=useGetAllComplaint()
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-2xl border `bg-gradient-to-br` from-slate-50 to-slate-100 p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Civic engagement
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Better city services start with better communication.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          CivicFlow connects residents, staff, and field teams in one
          streamlined service experience.
        </p>
      </section>
    </main>
  );
};

export default HomePage;
