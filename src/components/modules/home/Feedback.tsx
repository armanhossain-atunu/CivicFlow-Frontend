"use client";

import * as React from "react";

import { Quote, Star } from "lucide-react";

import { useGetFeedbacks } from "@/hooks/complain.hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Feedback = () => {
  const plugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: true,
    }),
  );


  const feedbackQuery = useGetFeedbacks();
  const feedback = feedbackQuery.data?.data ?? [];
 console.log("Full feedback response:", feedbackQuery.data);
console.log("First feedback:", feedbackQuery.data?.data?.[0]);
  if (feedbackQuery.isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-12">
        <Skeleton className="mx-auto h-8 w-56" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            "feedback-skeleton-1",
            "feedback-skeleton-2",
            "feedback-skeleton-3",
          ].map((key) => (
            <Skeleton key={key} className="h-64 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (feedbackQuery.isError) {
    return (
      <p className="py-12 text-center text-sm text-red-500">
        Failed to load feedback. Please try again later.
      </p>
    );
  }

  if (feedback.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-12">
      {/* Section heading */}
      <div className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Testimonials
        </p>

        <div className="text-3xl font-bold tracking-tight sm:text-4xl">
          What{" "}
          <span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">
            Citizens
          </span>{" "}
          Say
        </div>

        <p className="mx-auto max-w-2xl text-muted-foreground">
          Discover what citizens think about our complaint management services.
        </p>
      </div>

      {/* Feedback carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: feedback.length > 1,
        }}
        plugins={feedback.length > 1 ? [plugin.current] : []}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="mx-auto w-full"
      >
        <CarouselContent>
          {feedback.map((item  ) => (
            <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="h-full p-2">
                <Card className="h-full rounded-2xl border bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg">
                  <CardContent className="flex h-full flex-col gap-5 p-6">
                    {/* Rating */}
                    <div className="flex items-center justify-between gap-3">
                      <Quote className="h-8 w-8 text-primary/50" />

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={`star-${item.id}-${star}`}
                            className={`h-4 w-4 ${
                              star <= item.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}

                        <span className="ml-1 text-sm font-semibold">
                          {item.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="min-h-24 flex-1 text-sm leading-7 text-muted-foreground">
                      {item.comment || "Thank you for sharing your feedback."}
                    </p>

                    {/* Citizen details */}
                    {/* Citizen details */}
                    <div className="flex items-center gap-3 border-t pt-5">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage
                          src={item.citizen?.imageUrl || undefined}
                          alt={item.citizen?.name ?? "Citizen"}
                        />
                        <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                          {item.citizen?.name?.charAt(0)?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {item.citizen?.name ?? "Anonymous Citizen"}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {item.citizen?.email ?? "Citizen"}
                        </p>
                      </div>
                    </div>

                    {/* Complaint details */}
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        Complaint
                      </p>

                      <p className="mt-1 line-clamp-2 text-sm font-medium">
                        {item.complaint?.title ?? "Citizen complaint"}
                      </p>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        Tracking ID:{" "}
                        {item.complaint?.trackingId ?? item.complaintId}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {feedback.length > 1 && (
          <>
            <CarouselPrevious className="left-0 sm:-left-4" />
            <CarouselNext className="right-0 sm:-right-4" />
          </>
        )}
      </Carousel>
    </section>
  );
};

export default Feedback;
