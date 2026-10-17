
"use client";

import { useState, type FormEvent } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

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
    description:
      "Need help with a report, service status, or account access.",
  },
  {
    title: "Office",
    value: "+1 (800) 555-0142",
    description:
      "Reach our civic operations team during business hours.",
  },
];

const initialFormData = {
  name: "",
  email: "",
  message: "",
};

const ContactPage = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.add({
        title: "Missing information",
        description: "Please fill in all fields before submitting.",
        type: "error",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      // Frontend-only submission.
      // Connect your backend API here to actually send the message.

      setFormData({ ...initialFormData });

      toast.add({
        title: "Message submitted!",
        description:
          "Your form has been cleared successfully. Thank you for contacting CivicFlow.",
        type: "success",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <form
            className="mt-6 space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <Label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full name
              </Label>

              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                required
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus-visible:border-primary"
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
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus-visible:border-primary"
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
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help"
                required
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Submitting..." : "Send message"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
