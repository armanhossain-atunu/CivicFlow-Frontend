"use client";

import { cn } from "cn";
import type * as React from "react";

function Label({
  className,
  htmlFor,
  ...props
}: React.ComponentProps<"label"> & { htmlFor: string }) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: The control is associated via the dynamic htmlFor prop.
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
