import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandIcon, type BrandKey } from "@/components/common/BrandIcon";
import type { SourceShare } from "../types";

const CHART_COLORS: Record<BrandKey, string> = {
  gmail: "#EF4444",
  "google-calendar": "#3B82F6",
  "google-drive": "#22C55E",
  github: "#64748B",
  photos: "#F43F5E",
  notes: "#F59E0B",
  spotify: "#22C55E",
  whatsapp: "#10B981",
  memory: "#A855F7",
};

interface SourceDistributionChartProps {
  data?: SourceShare[];
  isLoading: boolean;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: SourceShare }> }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      <p className="font-medium text-white">{item.label}</p>
      <p className="text-slate-400">{item.value}% of activity</p>
    </div>
  );
}

export function SourceDistributionChart({ data, isLoading }: SourceDistributionChartProps) {
  return (
    <Card className="p-2">
      <CardHeader>
        <CardTitle>Source distribution</CardTitle>
        <CardDescription>Share of activity contributed by each connected source.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-56 w-full" />
        ) : (
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <div className="w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {data.map((entry) => (
                      <Cell key={entry.brand} fill={CHART_COLORS[entry.brand]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="w-full space-y-2 sm:w-1/2">
              {data.map((entry) => (
                <li key={entry.brand} className="flex items-center gap-2.5 text-[13px]">
                  <BrandIcon brand={entry.brand} size={22} className="h-[22px] w-[22px] shrink-0" />
                  <span className="flex-1 text-slate-300">{entry.label}</span>
                  <span className="font-medium text-white">{entry.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
