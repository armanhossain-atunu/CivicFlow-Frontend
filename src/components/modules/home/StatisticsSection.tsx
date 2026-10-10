"use client";

import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetComplaintStatistics } from "@/hooks/complain.hook";

const statistics = [
  {
    key: "totalComplaints",
    title: "Total Complaints",
    description: "Community issues reported through CivicFlow.",
    icon: FileText,
    theme:
      "bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:ring-blue-900",
    accent: "from-blue-600 to-sky-500",
  },
  {
    key: "resolvedComplaints",
    title: "Resolved Complaints",
    description: "Requests marked as resolved.",
    icon: CheckCircle2,
    theme:
      "bg-teal-50 text-teal-700 ring-1 ring-teal-100 dark:bg-teal-950/60 dark:text-teal-300 dark:ring-teal-900",
    accent: "from-teal-600 to-emerald-500",
  },
  {
    key: "activeRequests",
    title: "Active Requests",
    description: "Submitted, assigned, or in progress.",
    icon: Clock,
    theme:
      "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100 dark:bg-cyan-950/60 dark:text-cyan-300 dark:ring-cyan-900",
    accent: "from-cyan-600 to-blue-500",
  },
] as const;

export default function StatisticsSection() {
  const { data, isPending, isError } = useGetComplaintStatistics();

  return (
    <section
      aria-labelledby="civicflow-statistics-heading"
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-sky-400">
          CivicFlow in action
        </p>

        <h2
          id="civicflow-statistics-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
        >
          Community impact{" "}
          <span className="bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
            at a glance
          </span>
        </h2>

        <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">
          A live view of complaints and service requests across the community.
        </p>
      </div>

      {isError ? (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle aria-hidden="true" className="size-5 shrink-0" />
          <p>
            Complaint statistics are currently unavailable. Please try again
            later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statistics.map((statistic) => {
            const Icon = statistic.icon;

            return (
              <Card
                key={statistic.key}
                className="group relative overflow-hidden rounded-2xl border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900"
              >
                {/* Top gradient accent */}
                <div
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${statistic.accent}`}
                />

                <CardHeader className="flex-row items-start justify-between gap-4 pt-6">
                  <div className="space-y-2">
                    <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">
                      {statistic.title}
                    </CardTitle>

                    <CardDescription className="leading-6 text-slate-500 dark:text-slate-400">
                      {statistic.description}
                    </CardDescription>
                  </div>

                  <span
                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${statistic.theme}`}
                  >
                    <Icon
                      aria-hidden="true"
                      className="size-5"
                      strokeWidth={2}
                    />
                  </span>
                </CardHeader>

                <CardContent className="pb-6">
                  {isPending ? (
                    <Skeleton
                      className="h-10 w-28"
                      aria-label={`Loading ${statistic.title.toLowerCase()}`}
                    />
                  ) : (
                    <p className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                      {(data?.[statistic.key] ?? 0).toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
