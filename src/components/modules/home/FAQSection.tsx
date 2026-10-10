"use client";

import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is CivicFlow?",
    answer:
      "CivicFlow is a civic complaint management platform that helps citizens submit complaints, track their progress, and stay informed about public service issues.",
  },
  {
    question: "How can I submit a complaint?",
    answer:
      "Create an account, sign in, open the complaint submission page, provide the required details, select a category, and submit your complaint. If a fee applies, complete the required payment.",
  },
  {
    question: "How can I track my complaint?",
    answer:
      "Sign in to your account and visit the My Complaints section. You can view your complaint details and its current status, such as Submitted, Assigned, In Progress, or Resolved.",
  },
  {
    question: "Can I check who is handling my complaint?",
    answer:
      "When an authorized manager assigns a technician, assignment information may be available in your complaint details, depending on the information provided by the platform.",
  },
  {
    question: "Do all complaints require payment?",
    answer:
      "No. Payment requirements depend on the complaint category and its applicable fee. Review the displayed fee before proceeding. If payment is required, follow the available payment instructions.",
  },
  {
    question: "What do the different complaint statuses mean?",
    answer:
      "Submitted means your complaint has been received. Assigned means a technician has been assigned. In Progress means work is underway. Resolved means the issue has been marked as resolved, while Closed means the complaint process has been closed.",
  },
  {
    question: "Can I provide feedback after my complaint is closed?",
    answer:
      "If feedback is enabled for your closed complaint, open the complaint details and use the available feedback option to share your experience and rate the service.",
  },
  {
    question: "What should I do if my complaint is not resolved?",
    answer:
      "Check the latest status in your dashboard. If you need additional assistance, contact the relevant support team and provide your complaint ID so they can identify your request.",
  },
];

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-white px-4 py-20 dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-28"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-32 size-72 rounded-full bg-sky-100/70 blur-3xl dark:bg-sky-950/30"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-10 size-72 rounded-full bg-teal-100/60 blur-3xl dark:bg-teal-950/20"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
            <HelpCircle className="size-4" />
            Help Center
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            Find answers to common questions about submitting, tracking, and
            managing complaints with CivicFlow.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="mx-auto max-w-3xl">
          <Accordion className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${index + 1}`}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white px-5 shadow-sm transition-all duration-200 data-[state=open]:border-sky-200 data-[state=open]:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:data-[state=open]:border-sky-900 sm:px-6"
              >
                <AccordionTrigger className="gap-4 py-5 text-left text-sm font-semibold text-slate-800 hover:no-underline hover:text-sky-600 dark:text-slate-100 dark:hover:text-sky-400 sm:text-base [&>svg]:hidden">
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-xs font-bold text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span>{faq.question}</span>
                  </span>

                  <ChevronDown className="size-5 shrink-0 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </AccordionTrigger>

                <AccordionContent className="pb-5 pl-10 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact support card */}
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-teal-50 p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900 sm:p-8">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm dark:bg-slate-800 dark:text-sky-400">
              <MessageCircle className="size-6" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Still have questions?
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Need help with a complaint? Contact the appropriate support team
                for assistance.
              </p>
            </div>

            <a
              href="mailto:support@civicflow.com"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
