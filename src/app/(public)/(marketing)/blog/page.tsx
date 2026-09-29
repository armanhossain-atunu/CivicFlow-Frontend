const posts = [
  {
    title: "How digital reporting improves response times",
    summary:
      "Modern public service tools help cities reduce delays and improve transparency for residents.",
  },
  {
    title: "Three ways city teams can work more efficiently",
    summary:
      "Structured service workflows reduce confusion and help departments stay aligned.",
  },
  {
    title: "Why transparent updates build trust in local government",
    summary:
      "Clear communication creates stronger community confidence and better service outcomes.",
  },
];

const BlogPage = () => {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Blog
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Insights from CivicFlow
        </h1>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.title}
            className="rounded-2xl border bg-slate-50 p-6 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">
              Update
            </p>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              {post.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {post.summary}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default BlogPage;
