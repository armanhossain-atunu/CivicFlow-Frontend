"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ComplaintChartData {
  date: string;
  complaints: number;
  resolved: number;
}

// Demo data: replace with actual API analytics data.
const chartData: ComplaintChartData[] = [
  { date: "2026-10-01", complaints: 12, resolved: 7 },
  { date: "2026-10-03", complaints: 18, resolved: 11 },
  { date: "2026-10-05", complaints: 15, resolved: 10 },
  { date: "2026-10-07", complaints: 25, resolved: 17 },
  { date: "2026-10-09", complaints: 21, resolved: 16 },
  { date: "2026-10-11", complaints: 32, resolved: 24 },
  { date: "2026-10-13", complaints: 28, resolved: 22 },
];

const chartConfig = {
  complaints: {
    label: "Complaints",
    color: "var(--chart-1)",
  },
  resolved: {
    label: "Resolved",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ComplaintAreaChart() {
  const [range, setRange] = useState("7");

  const filteredData = useMemo(() => {
    const count = Number(range);
    return chartData.slice(-count);
  }, [range]);

  const totalComplaints = filteredData.reduce(
    (total, item) => total + item.complaints,
    0,
  );

  const totalResolved = filteredData.reduce(
    (total, item) => total + item.resolved,
    0,
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            Complaint Analytics
          </CardTitle>
          <CardDescription>
            Track complaints received and resolved over time.
          </CardDescription>
        </div>

        <Select
          value={range}
          onValueChange={(value) => {
            if (value !== null) {
              setRange(value);
            }
          }}
        >
          <SelectTrigger
            className="w-full sm:w-[160px]"
            aria-label="Select chart range"
          >
            <SelectValue placeholder="Select range" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="3">Last 3 points</SelectItem>
            <SelectItem value="5">Last 5 points</SelectItem>
            <SelectItem value="7">Last 7 points</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Total complaints
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {totalComplaints.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Resolved complaints
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {totalResolved.toLocaleString()}
            </p>
          </div>
        </div>

        <ChartContainer
          config={chartConfig}
          className="min-h-[280px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{
              top: 12,
              right: 12,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="complaintsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-complaints)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-complaints)"
                  stopOpacity={0.02}
                />
              </linearGradient>

              <linearGradient
                id="resolvedGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-resolved)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-resolved)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20}
              tickFormatter={(value: string) =>
                new Date(`${value}T00:00:00`).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  },
                )
              }
            />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={35}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) =>
                    new Date(`${value}T00:00:00`).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )
                  }
                />
              }
            />

            <Area
              type="monotone"
              dataKey="complaints"
              stroke="var(--color-complaints)"
              fill="url(#complaintsGradient)"
              strokeWidth={2}
              activeDot={{ r: 5 }}
            />

            <Area
              type="monotone"
              dataKey="resolved"
              stroke="var(--color-resolved)"
              fill="url(#resolvedGradient)"
              strokeWidth={2}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ChartContainer>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[var(--chart-1)]" />
            <span className="text-muted-foreground">Complaints</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[var(--chart-2)]" />
            <span className="text-muted-foreground">Resolved</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
