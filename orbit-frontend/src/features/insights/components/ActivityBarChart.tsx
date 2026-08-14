import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { WeeklyActivityPoint } from "../types";

interface ActivityBarChartProps {
  data?: WeeklyActivityPoint[];
  isLoading: boolean;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      <p className="font-medium text-white">{label}</p>
      <p className="text-slate-400">{payload[0].value} events</p>
    </div>
  );
}

export function ActivityBarChart({ data, isLoading }: ActivityBarChartProps) {
  const maxIndex = data?.reduce((maxI, d, i, arr) => (d.events > arr[maxI].events ? i : maxI), 0) ?? -1;

  return (
    <Card className="p-2">
      <CardHeader>
        <CardTitle>Weekly activity</CardTitle>
        <CardDescription>Events Orbit noticed across all sources, by day.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-56 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={224}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                tickLine={false}
              />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
              <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} content={<ChartTooltip />} />
              <Bar dataKey="events" radius={[6, 6, 0, 0]} maxBarSize={38}>
                {data.map((_, i) => (
                  <Cell key={i} fill={i === maxIndex ? "#8B5CF6" : "#3B82F6"} fillOpacity={i === maxIndex ? 1 : 0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
