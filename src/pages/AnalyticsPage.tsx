import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Clock,
  Users,
  ShieldCheck,
  Cpu,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Download,
} from 'lucide-react';
import { useRetail } from '../context/RetailContext';

export const AnalyticsPage: React.FC = () => {
  const { zones, hourlyTraffic, exportCSV } = useRetail();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Zone dwell times data for chart
  const zoneDwellData = zones.map(z => ({
    name: z.name.split('&')[0].trim(),
    fullName: z.name,
    dwellMinutes: z.avgDwellMinutes,
    currentShoppers: z.currentShoppers,
    capacity: z.capacity,
    health: z.stockHealthPct,
  }));

  // Privacy-safe edge group classification (derived on camera without storing facial data)
  const shopperGroups = [
    { name: 'Solo Shoppers', value: 48, color: '#2563eb' },
    { name: 'Pairs / Couples', value: 28, color: '#0284c7' },
    { name: 'Family Groups (3+)', value: 18, color: '#10b981' },
    { name: 'Group / Colleagues', value: 6, color: '#f59e0b' },
  ];

  // Hourly conversion throughput
  const conversionTrendData = hourlyTraffic.map(p => ({
    hour: p.hour,
    conversionRate: Math.min(92, Math.max(68, Math.round((p.convertedShoppers / (p.footfall || 1)) * 100))),
    footfall: p.footfall,
    waitTimeSec: p.avgWaitSec,
  }));

  return (
    <div id="analytics-page" className="space-y-6 pb-12">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-tight">
              Shopper Intelligence & In-Store Analytics
            </h2>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              100% Privacy Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Edge-derived spatial behavior, journey dwell times, and conversion funnels computed strictly on-device
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time range selector */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            {(['today', 'week', 'month'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-md capitalize transition-all ${
                  timeRange === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => exportCSV('daily')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Export Data
          </button>
        </div>
      </div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zone Dwell Time Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-600" />
                Average Dwell Time by Store Zone
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                How long shoppers linger in each section before progressing to billing
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Store Avg: 7.2 mins
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneDwellData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="m" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} minutes`, 'Avg Dwell Time']}
                />
                <Bar dataKey="dwellMinutes" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span>Highest Dwell: <strong className="text-slate-800">Apparel (14.5m)</strong></span>
            <span>Highest Traffic: <strong className="text-slate-800">Fresh Produce & Dairy (26 shoppers)</strong></span>
            <span className="text-emerald-600 font-semibold">Correlates with +24% larger basket size</span>
          </div>
        </div>

        {/* Shopper Grouping & Composition */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <Users className="h-4 w-4 text-blue-600" />
                Shopper Group Demographics
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Edge Cluster</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Autonomous proximity grouping calculated without biometric identification
            </p>

            <div className="h-48 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shopperGroups}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {shopperGroups.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Share']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 mt-2">
              {shopperGroups.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3 text-[11px] text-slate-500 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-blue-600 shrink-0" />
            <span>Families spend 2.8x more in Groceries & Dairy</span>
          </div>
        </div>
      </div>

      {/* Hourly Conversion Rate & Queue Correlation */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Hourly Conversion Rate vs Checkout Wait Time
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Proof that keeping queue wait under 4 minutes directly protects the store conversion rate
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Conversion Rate (%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Queue Wait (Seconds)
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={conversionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="s" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="conversionRate"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="waitTimeSec"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 text-slate-800">
            <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
            <span>
              <strong>Key Retail Finding:</strong> When queue wait exceeds 300 seconds (5 mins), conversion rate drops sharply from 82% to 71% as shoppers abandon baskets.
            </span>
          </div>
          <span className="font-semibold text-blue-700 self-end sm:self-auto shrink-0 flex items-center gap-1">
            Proactive Queue AI ROI <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {/* Edge Hardware & Privacy Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Privacy Architecture</p>
            <p className="text-sm font-bold text-slate-900">Zero Cloud Frame Upload</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">100% On-Premises Vision</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Edge Compute Cluster</p>
            <p className="text-sm font-bold text-slate-900">4x Edge Nodes (28.4 FPS)</p>
            <p className="text-[11px] text-blue-600 font-medium mt-0.5">YOLOv8 INT8 Quantized</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Edge Latency SLA</p>
            <p className="text-sm font-bold text-slate-900">14.2 ms End-to-End</p>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">Near Real-Time Detection</p>
          </div>
        </div>
      </div>
    </div>
  );
};
