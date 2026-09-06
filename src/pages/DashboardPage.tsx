import React from 'react';
import {
  Users,
  Footprints,
  Clock,
  CheckCircle2,
  BellRing,
  Percent,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useRetail } from '../context/RetailContext';
import { KPICard } from '../components/KPICard';
import { StoreHeatmap } from '../components/StoreHeatmap';
import { QueueOverviewWidget } from '../components/QueueOverviewWidget';
import { ShelfMonitorWidget } from '../components/ShelfMonitorWidget';
import { AlertsTable } from '../components/AlertsTable';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { kpis, hourlyTraffic, alerts } = useRetail();

  return (
    <div id="dashboard-page" className="space-y-6 pb-12">
      {/* Top Welcome / Edge Mission Banner in Modern Dark SaaS Style */}
      <div className="bg-[#0f172a] rounded-xl p-5 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
              On-Device Edge Inference Active
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-300">100% Privacy Preserved (Zero Cloud Video Stream)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold mt-1 text-white tracking-tight">
            Store #104 Operations Intelligence Overview
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time on-premise AI monitoring footfall density, queue wait times, and automated shelf availability with zero cloud latency.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
          <Link
            to="/staff"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-xs font-semibold text-white transition-colors shadow-xs"
          >
            Launch Staff Terminal <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Row - Strictly aligned with 6 Core Retail Intelligence KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <KPICard
          id="kpi-footfall"
          title="Footfall"
          value={kpis.footfallToday.toLocaleString()}
          unit="shoppers"
          changePct={kpis.footfallChangePct}
          changeLabel="vs yesterday"
          secondaryInfo={`${kpis.customersInside} inside now`}
          icon={<Footprints className="h-4 w-4 text-blue-500" />}
          status="normal"
          progressPct={72}
        />

        <KPICard
          id="kpi-conversion"
          title="Conversion"
          value={kpis.conversionRatePct}
          unit="%"
          changePct={kpis.conversionChangePct}
          changeLabel="vs last week"
          secondaryInfo="412 transactions"
          icon={<Percent className="h-4 w-4 text-emerald-500" />}
          status="success"
          progressPct={kpis.conversionRatePct}
        />

        <KPICard
          id="kpi-queue-wait"
          title="Avg Queue Time"
          value={kpis.avgQueueTimeMinutes}
          unit="mins"
          changePct={kpis.queueTimeChangePct}
          changeLabel="target: <4.5m"
          secondaryInfo="3 open counters"
          icon={<Clock className="h-4 w-4 text-amber-500" />}
          status={kpis.avgQueueTimeMinutes > 4.5 ? 'danger' : 'normal'}
          progressPct={Math.min(100, Math.round((kpis.avgQueueTimeMinutes / 8) * 100))}
        />

        <KPICard
          id="kpi-staff-efficiency"
          title="Staff Efficiency"
          value={91.8}
          unit="%"
          changePct={3.2}
          changeLabel="operational SLA"
          secondaryInfo="4 of 5 active"
          icon={<Users className="h-4 w-4 text-indigo-500" />}
          status="success"
          progressPct={92}
        />

        <KPICard
          id="kpi-stock-availability"
          title="Stock Availability"
          value={kpis.stockAvailabilityPct}
          unit="%"
          changePct={kpis.stockAvailabilityChangePct}
          changeLabel="on-shelf availability"
          secondaryInfo="34 SKUs monitored"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          status={kpis.stockAvailabilityPct < 85 ? 'warning' : 'success'}
          progressPct={kpis.stockAvailabilityPct}
        />

        <KPICard
          id="kpi-active-alerts"
          title="Active Alerts"
          value={kpis.activeAlertsCount}
          unit={kpis.criticalAlertsCount > 0 ? `(${kpis.criticalAlertsCount} crit)` : undefined}
          secondaryInfo={kpis.criticalAlertsCount > 0 ? 'Immediate Action' : 'All clear'}
          icon={<BellRing className="h-4 w-4 text-rose-500" />}
          status={kpis.criticalAlertsCount > 0 ? 'danger' : kpis.activeAlertsCount > 0 ? 'warning' : 'success'}
          progressPct={kpis.activeAlertsCount > 0 ? 80 : 15}
        />
      </div>

      {/* Real-Time AI Autonomous Recommendation Banner matching theme */}
      <div className="bg-[#0f172a] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:px-6 sm:py-4 gap-4 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-full border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-sm bg-blue-500/10 shrink-0">
            <Sparkles className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">
              Autonomous Edge Recommendation
            </p>
            <p className="text-white text-xs sm:text-sm font-medium">
              Counter 4 recommended to open in 8 mins: Predicted +28% surge in produce & billing zones
            </p>
          </div>
        </div>
        <Link
          to="/staff"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors whitespace-nowrap shadow-xs"
        >
          Dispatch Staff
        </Link>
      </div>

      {/* Traffic Trend Chart & Operational Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Traffic Curve */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Shopper Traffic & In-Store Occupancy</h3>
                <span className="flex items-center gap-1 rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                  Today (08:00 - 22:00)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Hourly footfall entering the turnstiles vs concurrently active shoppers
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Hourly Footfall
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Live Occupancy
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyTraffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFootfall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                  formatter={(val: any, name: any) => [
                    `${val} shoppers`,
                    name === 'footfall' ? 'Footfall Entering' : 'Active Inside',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="footfall"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorFootfall)"
                />
                <Area
                  type="monotone"
                  dataKey="occupancy"
                  stroke="#64748b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOccupancy)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Peak Flow Window: <strong className="text-slate-800">18:00 - 19:30 (Evening Rush)</strong></span>
            <span>Predicted Next Hour: <strong className="text-blue-600">+18% increase</strong></span>
          </div>
        </div>

        {/* Staff Efficiency & Edge AI Operations Health Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Staffing Efficiency</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                91.2% SLA
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Active Checkouts</span>
                  <span className="text-slate-900 font-semibold">4 / 5 Open</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Restock SLA Adherence</span>
                  <span className="text-slate-900 font-semibold">94.8% on-time</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94.8%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Floor Assistance Velocity</span>
                  <span className="text-slate-900 font-semibold">2.1 min response</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '86%' }} />
                </div>
              </div>
            </div>

            {/* Micro edge insight */}
            <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <p className="text-[11px] leading-relaxed">
                Apparel zone has low customer traffic (8 shoppers). System recommends transferring 1 associate to Fresh Produce & Billing Counter 4.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500">Scheduled Staff: 6 Active</span>
            <Link to="/staff" className="font-semibold text-blue-600 hover:text-blue-800">
              Manage Staff & Tasks →
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Store Floorplan & Heatmap */}
      <StoreHeatmap />

      {/* Proactive Queue & Checkout Management */}
      <QueueOverviewWidget />

      {/* Automated Shelf Availability Grid */}
      <ShelfMonitorWidget />

      {/* Real-time Alerts Ticker / Quick View */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Active Operational Incidents</h3>
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 border border-rose-200">
                {alerts.filter(a => !a.resolved).length} Unresolved
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-priority events requiring immediate store floor attention
            </p>
          </div>

          <Link
            to="/alerts"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Open Alert Center →
          </Link>
        </div>

        <div className="mt-4">
          <AlertsTable compact limit={3} />
        </div>
      </div>
    </div>
  );
};
