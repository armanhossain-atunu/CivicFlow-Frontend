
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, MapPin } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
        {/* Left Content */}
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-medium text-cyan-800 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            Smarter Civic Services for Everyone
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Your City,
            <span className="block text-blue-700">
              Your Voice.
            </span>
            <span className="block">Our Responsibility.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Report local issues, track complaint progress, and connect
            with your city service team. Together, we can build a cleaner,
            safer, and better community.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/complaint"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
            >
              Report an Issue
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/dashboard/citizen"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
            >
              Track Complaints
              <MapPin className="h-5 w-5" />
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            Transparent reporting. Better public services.
          </div>
        </div>

        {/* Right Image */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-200/50 to-cyan-200/50 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-white shadow-2xl shadow-slate-900/10">
            <Image
              src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=85"
              alt="Modern city buildings representing a better urban community"
              width={1200}
              height={900}
              priority
              className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-white/90 p-4 shadow-xl backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    A Better Community Starts Here
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Your report can make a difference.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-3 -top-4 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-lg sm:block">
            <p className="text-sm font-semibold text-slate-900">
              CivicFlow
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Better services, together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

