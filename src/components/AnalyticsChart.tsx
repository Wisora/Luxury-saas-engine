'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mocked historical telemetry data
const telemetryData = [
  { date: 'Oct 01', clicks: 120, conversions: 8 },
  { date: 'Oct 02', clicks: 190, conversions: 14 },
  { date: 'Oct 03', clicks: 310, conversions: 22 },
  { date: 'Oct 04', clicks: 280, conversions: 19 },
  { date: 'Oct 05', clicks: 450, conversions: 35 },
  { date: 'Oct 06', clicks: 390, conversions: 28 },
  { date: 'Oct 07', clicks: 520, conversions: 42 },
];

export default function AnalyticsChart() {
  const [isMounted, setIsMounted] = useState(false);

  // Prevents SSR hydration mismatch for SVG charts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[280px] w-full flex items-center justify-center text-xs text-slate-600 font-mono">
        Loading Telemetry Engine...
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={telemetryData}>
          <defs>
            <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#090d16',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '0.75rem',
              color: '#fff',
              fontSize: '12px',
            }}
            itemStyle={{ color: '#f59e0b' }}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#f59e0b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#clickGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}