"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  distance: {
    label: "Distance",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

interface TotalDistanceChartProps {
  data: { month_text: string; distance: number }[];
}

export function TotalDistanceChart({ data }: TotalDistanceChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <AreaChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month_text"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          dataKey="distance"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} mi`}
        />
        <Area
          fill="var(--color-distance)"
          stroke="var(--color-distance)"
          dataKey="distance"
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
      </AreaChart>
    </ChartContainer>
  );
}
