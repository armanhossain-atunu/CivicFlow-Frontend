import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const contactOptions = [
  {
    title: "General inquiries",
    value: "hello@civicflow.com",
    description:
      "Questions about the CivicFlow platform, onboarding, or partnerships.",
  },
  {
    title: "Support desk",
    value: "support@civicflow.com",
    description: "Need help with a report, service status, or account access.",
  },
  {
    title: "Office",
    value: "+1 (800) 555-0142",
    description: "Reach our civic operations team during business hours.",
  },
];

const ContactPage = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Contact
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Let’s make city services more responsive
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600">
            Whether you’re a resident, municipal team member, or partner
            organization, we can help you improve how communities report and
            resolve service issues.
          </p>

          <div className="mt-8 space-y-5">
            {contactOptions.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border bg-slate-50 p-5"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h2>
                <p className="mt-2 text-base font-medium text-primary">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Send a message
          </h2>
          <form className="mt-6 space-y-4">
            <div>
              <Label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full name
              </Label>
              <Input
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <Label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </Label>
              <Input
                type="email"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Message
              </Label>
              <textarea
                rows={5}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-0 focus:border-primary"
                placeholder="Tell us how we can help"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Send message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
