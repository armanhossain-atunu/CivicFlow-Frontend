"use client";

import { Activity, ArrowUpRight, Eye, ShieldCheck } from "lucide-react";

const features = [
  {
    number: "01",
    title: "Transparency",
    description:
      "Stay informed at every step. View your complaint details, check status updates, and follow progress with greater clarity.",
    icon: Eye,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-100 dark:bg-sky-950",
  },
  {
    number: "02",
    title: "Accountability",
    description:
      "Complaints can be assigned to responsible technicians and managed by authorized staff to support ownership and timely resolution.",
    icon: ShieldCheck,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100 dark:bg-emerald-950",
  },
  {
    number: "03",
    title: "Easy Tracking",
    description:
      "Follow your complaint from submission to resolution with an easy-to-understand status and a simple tracking experience.",
    icon: Activity,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-100 dark:bg-violet-950",
  },
];

export default function WhyChooseSection() {
  return (
    <section
      id="why-civicflow"
      className="relative isolate overflow-hidden bg-slate-50 px-4 py-20 dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-28"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 -z-10 size-80 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-900/20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 size-80 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-900/20"
      />

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center sm:mb-16">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
            <ShieldCheck className="size-4" />
            Why CivicFlow
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">
              CivicFlow?
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            Building better communities through transparency, accountability,
            and accessible public services.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-950/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800 sm:p-8"
              >
                {/* Card number */}
                <div className="absolute right-6 top-6 text-sm font-bold tracking-widest text-slate-300 transition-colors group-hover:text-sky-500 dark:text-slate-700">
                  {feature.number}
                </div>

                {/* Icon */}
                <div
                  className={`mb-7 flex size-14 items-center justify-center rounded-2xl ${feature.iconBg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon
                    className={`size-7 ${feature.iconColor}`}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                  {feature.description}
                </p>

                {/* Bottom accent */}
                <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Better public services
                  </span>

                  <span className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-sky-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-300">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom message */}
        <div className="mt-10 text-center">
          <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
            Your voice matters. Together, we can build more responsive
            communities.
          </p>
        </div>
      </div>
    </section>
  );
}
