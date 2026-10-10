"use client";

import { Button } from "@/components/ui/button";

export type StatusOption = {
  value: string;
  label: string;
};

type CommonStatusFilterProps = {
  value: string;
  options: StatusOption[];
  onChange: (value: string) => void;
};

export function CommonStatusFilter({
  value,
  options,
  onChange,
}: CommonStatusFilterProps) {
  return (
    <div className="flex w-full gap-2 overflow-x-auto pb-1">
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="sm"
          variant={value === option.value ? "default" : "outline"}
          className="shrink-0"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
