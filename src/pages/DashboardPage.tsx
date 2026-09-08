import React, { useState } from 'react';
import {
  Footprints,
  Clock,
  CheckCircle2,
  Percent,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Package,
  ShoppingCart,
  CheckCheck,
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
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const {
    kpis,
    hourlyTraffic,
    alerts,
    recommendations,
    applyRecommendation,
    counters,
    shelves,
  } = useRetail();

  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Highest priority unapplied recommendation
  const unappliedRecs = recommendations.filter(r => !r.applied);
  const activeRecommendation = unappliedRecs[0];

  // Derive counts for supporting status summaries
  const openCounters = counters.filter(c => c.status === 'open' || c.status === 'express');
  const activeAlerts = alerts.filter(a => !a.resolved);
  const criticalAlertsCount = activeAlerts.filter(a => a.severity === 'critical').length;
  const highAlertsCount = activeAlerts.filter(a => a.severity === 'high').length;
  const outOfStockShelves = shelves.filter(s => s.status === 'out_of_stock');
  const lowStockShelves = shelves.filter(s => s.status === 'low_stock');

  const handleTakeAction = (recId: string, actionLabel: string) => {
    applyRecommendation(recId);
    setActionSuccessMessage(`Action executed: ${actionLabel}`);
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 4000);
  };

  return (
    <div id="dashboard-page" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Active
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">Store #104 (Hypermarket)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Store Operations Intelligence Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time shopper flow, operational bottlenecks, and automated AI recommendations
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/staff"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold text-white transition-colors shadow-xs"
          >
            Launch Staff Terminal <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* SECTION 1 — TOP SUMMARY / KPIS (5 Priority Operational Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <KPICard
          id="kpi-footfall"
          title="Footfall"
          value={kpis.footfallToday.toLocaleString()}
          changePct={kpis.footfallChangePct}
          changeLabel="vs yday"
          secondaryInfo={`${kpis.customersInside} inside`}
          icon={<Footprints className="h-4 w-4 text-blue-500" />}
          status="normal"
        />

        <KPICard
          id="kpi-conversion"
          title="Conversion"
          value={kpis.conversionRatePct}
          unit="%"
          changePct={kpis.conversionChangePct}
          changeLabel="vs last wk"
          secondaryInfo="412 txns"
          icon={<Percent className="h-4 w-4 text-emerald-500" />}
          status="success"
        />

        <KPICard
          id="kpi-queue-wait"
          title="Avg Queue Time"
          value={kpis.avgQueueTimeMinutes}
          unit="min"
          comparisonText={`${kpis.queueTimeChangePct > 0 ? '+' : ''}${kpis.queueTimeChangePct}m vs target`}
          secondaryInfo="Target < 4.5m"
          icon={<Clock className="h-4 w-4 text-amber-500" />}
          status={kpis.avgQueueTimeMinutes > 4.5 ? 'danger' : 'normal'}
        />

        <KPICard
          id="kpi-stock-availability"
          title="Stock Availability"
          value={kpis.stockAvailabilityPct}
          unit="%"
          changePct={kpis.stockAvailabilityChangePct}
          changeLabel="vs SLA"
          secondaryInfo={`${outOfStockShelves.length + lowStockShelves.length} SKUs low`}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          status={kpis.stockAvailabilityPct < 85 ? 'warning' : 'success'}
        />

        <KPICard
          id="kpi-active-alerts"
          title="Active Alerts"
          value={activeAlerts.length}
          comparisonText={
            criticalAlertsCount > 0
              ? `${criticalAlertsCount} critical`
              : `${highAlertsCount} high priority`
          }
          secondaryInfo="Requires review"
          icon={<AlertTriangle className="h-4 w-4 text-rose-500" />}
          status={criticalAlertsCount > 0 ? 'danger' : highAlertsCount > 0 ? 'danger' : activeAlerts.length > 0 ? 'warning' : 'success'}
        />
      </div>

      {/* SECTION 2 — PRIORITY ISSUE & AI ACTION (Action Required Dominant Card) */}
      <div id="dashboard-action-required">
        {actionSuccessMessage && (
          <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in duration-200">
            <span className="flex items-center gap-2 font-semibold">
              <CheckCheck className="h-4 w-4 text-emerald-600" />
              {actionSuccessMessage}
            </span>
            <span className="text-[11px] text-emerald-600">Updated store telemetry</span>
          </div>
        )}

        {activeRecommendation ? (
          <div className="bg-white rounded-xl border-l-4 border-l-rose-500 border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  ACTION REQUIRED
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">{activeRecommendation.timestamp}</span>
              </div>
              <span className="text-xs font-medium text-slate-400">Highest Priority Issue</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
              {/* Issue */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Issue
                </span>
                <p className="text-sm font-bold text-slate-900 leading-snug">
                  {activeRecommendation.type === 'open_counter'
                    ? 'Checkout congestion predicted'
                    : activeRecommendation.type === 'replenish_shelf'
                    ? 'Shelf stock-out predicted'
                    : 'Store floor imbalance predicted'}
                </p>
                <span className="text-xs text-slate-500 mt-0.5 block">
                  Location: {activeRecommendation.targetZone}
                </span>
              </div>

              {/* Current State */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Current state
                </span>
                {activeRecommendation.type === 'open_counter' ? (
                  <div className="space-y-0.5 text-xs">
                    <p className="text-slate-800">
                      Queue wait: <strong className="text-rose-600 font-bold">{kpis.avgQueueTimeMinutes} min</strong>
                    </p>
                    <p className="text-slate-500">
                      Target: <strong className="text-slate-700 font-semibold">&lt; 4.5 min</strong>
                    </p>
                  </div>
                ) : activeRecommendation.type === 'replenish_shelf' ? (
                  <div className="space-y-0.5 text-xs">
                    <p className="text-slate-800">
                      On-shelf: <strong className="text-rose-600 font-bold">4 units</strong>
                    </p>
                    <p className="text-slate-500">
                      Target: <strong className="text-slate-700 font-semibold">&gt; 15 units</strong>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0.5 text-xs">
                    <p className="text-slate-800">
                      Status: <strong className="text-amber-600 font-bold">Density Alert</strong>
                    </p>
                    <p className="text-slate-500">
                      Target: <strong className="text-slate-700 font-semibold">Balanced Flow</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* AI Recommendation */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1 mb-1">
                  <Sparkles className="h-3 w-3 text-blue-500" />
                  AI Recommendation
                </span>
                <p className="text-sm font-bold text-slate-900 leading-snug">
                  {activeRecommendation.type === 'open_counter'
                    ? 'Open Counter 4 / Deploy 1 associate'
                    : activeRecommendation.action}
                </p>
                <span className="text-xs text-slate-500 mt-0.5 block truncate" title={activeRecommendation.reason}>
                  {activeRecommendation.reason}
                </span>
              </div>

              {/* Expected Impact & Action */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Expected impact
                  </span>
                  <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    {activeRecommendation.type === 'open_counter'
                      ? 'Reduce queue pressure'
                      : activeRecommendation.type === 'replenish_shelf'
                      ? 'Prevent lost revenue'
                      : 'Restore balanced traffic'}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTakeAction(activeRecommendation.id, activeRecommendation.action)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all text-center cursor-pointer"
                  >
                    Take Action
                  </button>
                  <Link
                    to="/staff"
                    className="px-2.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Staff Terminal →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">All Operations Optimal</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Checkout queues, staffing balance, and shelf health are currently operating within SLA targets.
                </p>
              </div>
            </div>
            <Link
              to="/staff"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs whitespace-nowrap"
            >
              Staff Terminal →
            </Link>
          </div>
        )}
      </div>

      {/* SECTION 3 — SUPPORTING VISUALS (Shopper Traffic & Staffing Efficiency) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Shopper Traffic Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                Shopper Traffic
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Hourly footfall flow vs in-store occupancy
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

          <div className="h-60 sm:h-64 w-full pt-4">
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
            <span>Peak Window: <strong className="text-slate-800">18:00 - 19:30</strong></span>
            <Link to="/analytics" className="font-semibold text-blue-600 hover:text-blue-800">
              View Analytics →
            </Link>
          </div>
        </div>

        {/* Staffing Efficiency Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Staffing Efficiency</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Operational SLA
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Active Checkouts</span>
                  <span className="text-slate-900 font-semibold">{openCounters.length} / {counters.length} Lanes Open</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((openCounters.length / counters.length) * 100)}%` }}
                  />
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
                  <span className="text-slate-900 font-semibold">2.1 min avg response</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '86%' }} />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
              <p className="text-[11px] leading-relaxed">
                Floor load balancing automatically redirects idle capacity to high-density checkout and produce aisles.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500">Scheduled: 6 Active</span>
            <Link to="/staff" className="font-semibold text-blue-600 hover:text-blue-800">
              Manage Staff →
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 4 — STORE ACTIVITY & SHOPPER DENSITY (Store Heatmap) */}
      <div className="py-2">
        <StoreHeatmap />
      </div>

      {/* SECTION 5 — DETAIL LINKS (Compact Operational Summaries) */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
              Operational Status Summaries
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeted operational snapshots with direct links to full management tools
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Queue Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-tight flex items-center gap-1.5">
                  <ShoppingCart className="h-3.5 w-3.5 text-blue-600" />
                  Checkout Queues
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    kpis.avgQueueTimeMinutes > 4.5
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {kpis.avgQueueTimeMinutes > 4.5 ? 'Congested' : 'Optimal'}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs">
                <p className="text-slate-800 font-semibold">
                  {openCounters.length} of {counters.length} lanes active
                </p>
                <p className="text-slate-500">
                  {counters.reduce((acc, c) => acc + c.queueLength, 0)} shoppers waiting across open counters
                </p>
                {kpis.avgQueueTimeMinutes > 4.5 && (
                  <p className="text-rose-600 font-medium text-[11px] pt-1">
                    Critical: Counter 2 queue exceeds SLA threshold
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
              <span className="text-slate-400">Checkout Management</span>
              <Link to="/staff" className="font-semibold text-blue-600 hover:text-blue-800">
                View details →
              </Link>
            </div>
          </div>

          {/* Shelf Inventory Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-tight flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-indigo-600" />
                  Shelf Replenishment
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    outOfStockShelves.length > 0
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {outOfStockShelves.length > 0 ? `${outOfStockShelves.length} Stock-out` : 'Stocked'}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs">
                <p className="text-slate-800 font-semibold">
                  {outOfStockShelves.length + lowStockShelves.length} products need replenishment
                </p>
                <p className="text-slate-500">
                  {outOfStockShelves.length} stock-out in Dairy • {lowStockShelves.length} low stock SKUs
                </p>
                {outOfStockShelves.length > 0 && (
                  <p className="text-amber-700 font-medium text-[11px] pt-1">
                    Immediate restock flagged for Amul Taaza Milk 1L
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
              <span className="text-slate-400">Inventory Management</span>
              <Link to="/staff" className="font-semibold text-blue-600 hover:text-blue-800">
                View details →
              </Link>
            </div>
          </div>

          {/* Incident Alerts */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-tight flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                  Incident Alerts
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    criticalAlertsCount > 0
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : highAlertsCount > 0
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {criticalAlertsCount > 0
                    ? `${criticalAlertsCount} Critical`
                    : highAlertsCount > 0
                    ? `${highAlertsCount} High Priority`
                    : `${activeAlerts.length} Active`}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs">
                <p className="text-slate-800 font-semibold">
                  {activeAlerts.length} active alerts ({criticalAlertsCount > 0 ? `${criticalAlertsCount} critical` : `${highAlertsCount} high priority`})
                </p>
                <p className="text-slate-500">
                  Highest priority: {activeAlerts[0]?.title || 'None'}
                </p>
                <p className="text-slate-400 text-[11px] pt-1">
                  Camera vision telemetry verified on edge
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
              <span className="text-slate-400">Alert Center</span>
              <Link to="/alerts" className="font-semibold text-blue-600 hover:text-blue-800">
                View Alerts →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
