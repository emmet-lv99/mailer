"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

interface StatsChartProps {
  data: any[];
}

export function StatsChart({ data }: StatsChartProps) {
  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>일자별 공구제안 통계</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              minTickGap={30}
              tickFormatter={(value) => value.split('-').slice(1).join('/')}
            />
            <YAxis 
               axisLine={false}
               tickLine={false}
               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '13px'
                }}
            />
            <Legend verticalAlign="top" align="right" height={36}/>
            <Area
              type="monotone"
              dataKey="added"
              name="인플루언서 추가"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorAdded)"
            />
            <Area
              type="monotone"
              dataKey="sent"
              name="공구 제안"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorSent)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
