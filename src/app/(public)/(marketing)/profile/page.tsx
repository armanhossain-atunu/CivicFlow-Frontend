"use client";

import { useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent, useRef } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetme, useUpdateProfile } from "@/hooks";

export default function ProfilePage() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { data, error, isError, isLoading } = useGetme();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const user = data?.data;

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0];
    event.target.value = "";

    if (!image) {
      return;
    }

    if (!image.type.startsWith("image/")) {
      toast.add({
        title: "Invalid file",
        description: "Please choose an image file.",
        type: "error",
      });
      return;
    }

    updateProfile(image, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        toast.add({
          title: "Profile image updated",
          description: "Your new profile image is now saved.",
          type: "success",
        });
      },
      onError: (updateError) => {
        toast.add({
          title: "Unable to update profile image",
          description:
            updateError instanceof Error
              ? updateError.message
              : "Please try again.",
          type: "error",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <output className="text-muted-foreground">
          Loading your profile...
        </output>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold">Unable to load profile</h1>
        <p className="mt-2 text-muted-foreground">
          {error instanceof Error ? error.message : "Please try again later."}
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-2 text-muted-foreground">
          No profile information is available.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="size-20">
            <AvatarImage
              src={user.imageUrl || undefined}
              alt={user.name ?? "Profile"}
            />
            <AvatarFallback className="text-xl">
              {user.name?.charAt(0).toUpperCase() ??
                user.email?.charAt(0).toUpperCase() ??
                "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-sm text-muted-foreground">
              {user.name || user.email}
            </p>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label="Choose a new profile image"
              onChange={handleImageChange}
            />
            <Button
              type="button"
              variant="outline"
              className="mt-3"
              disabled={isUpdatingProfile}
              onClick={() => imageInputRef.current?.click()}
            >
              {isUpdatingProfile ? "Uploading..." : "Change photo"}
            </Button>
          </div>
        </div>
        <dl className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Name</dt>
            <dd className="mt-1">{user.name || "Not provided"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Email</dt>
            <dd className="mt-1">{user.email || "Not provided"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Contact number
            </dt>
            <dd className="mt-1">{user.contactNumber || "Not provided"}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
