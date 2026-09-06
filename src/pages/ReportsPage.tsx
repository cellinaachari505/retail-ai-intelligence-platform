import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  Clock,
  Package,
  Users,
  Percent,
  CheckCircle2,
  BarChart3,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { useRetail } from '../context/RetailContext';
import { INITIAL_WEEKLY_REPORTS } from '../services/retailDataService';

export const ReportsPage: React.FC = () => {
  const { reports, exportCSV } = useRetail();
  const [reportType, setReportType] = useState<'daily' | 'weekly'>('daily');
  const [trendView, setTrendView] = useState<'all' | 'footfall' | 'queue' | 'inventory' | 'kpis'>('all');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const activeData = reportType === 'daily' ? reports : INITIAL_WEEKLY_REPORTS;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="reports-page" className="space-y-6 pb-12 print:p-0 print:m-0 print:space-y-4">
      {/* Printable Executive Report Header (Visible in print) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              Retail Intelligence Platform — Executive Operations Audit
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Smart India Hackathon • On-Device AI Retail Analytics & Queue Optimization
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="font-bold text-slate-900">HyperMarket Store #104</p>
            <p>Report Mode: {reportType === 'daily' ? '7-Day Daily Audit' : 'Multi-Week Trend'}</p>
            <p>Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Report Controls & Header (Interactive) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-tight">
              Retail Operations & Audit Reports
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              SIH Phase-2 Validated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic audit reports including footfall trends, queue wait times, inventory stockouts, and staff efficiency.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Daily vs Weekly Toggle */}
          <div className="flex bg-slate-100 p-0.5 rounded-md text-xs font-semibold">
            <button
              type="button"
              id="report-toggle-daily"
              onClick={() => setReportType('daily')}
              className={`px-3 py-1.5 rounded transition-all ${
                reportType === 'daily' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Daily (Past 7 Days)
            </button>
            <button
              type="button"
              id="report-toggle-weekly"
              onClick={() => setReportType('weekly')}
              className={`px-3 py-1.5 rounded transition-all ${
                reportType === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Weekly Report
            </button>
          </div>

          {/* Export Dropdown Menu */}
          <div className="relative">
            <button
              type="button"
              id="export-csv-btn"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export CSV</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showExportMenu && (
              <div
                className="absolute right-0 mt-1.5 w-52 rounded-lg bg-white p-1 shadow-lg ring-1 ring-slate-900/10 z-50 border border-slate-200 text-xs"
                onClick={() => setShowExportMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => exportCSV(reportType)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 font-medium text-slate-800 flex items-center justify-between"
                >
                  <span>{reportType === 'daily' ? 'Daily' : 'Weekly'} Report CSV</span>
                  <span className="text-[10px] text-blue-600 font-mono">.csv</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportCSV('inventory')}
                  className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 font-medium text-slate-800 flex items-center justify-between"
                >
                  <span>Inventory Health Audit</span>
                  <span className="text-[10px] text-emerald-600 font-mono">.csv</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportCSV('alerts')}
                  className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 font-medium text-slate-800 flex items-center justify-between"
                >
                  <span>Alert Incident Log</span>
                  <span className="text-[10px] text-rose-600 font-mono">.csv</span>
                </button>
              </div>
            )}
          </div>

          {/* Print / PDF Button */}
          <button
            type="button"
            id="print-pdf-btn"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            PDF Export / Print
          </button>
        </div>
      </div>

      {/* Aggregate KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:border-slate-300">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Avg Footfall</span>
          <p className="text-xl font-bold text-slate-900 mt-1 font-mono">
            {reportType === 'daily' ? '3,168 / day' : '21,580 / wk'}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">+8.4% WoW</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:border-slate-300">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Conversion Rate</span>
          <p className="text-xl font-bold text-slate-900 mt-1 font-mono">78.9%</p>
          <span className="text-[11px] text-emerald-600 font-semibold">+2.3% YoY</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:border-slate-300">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Avg Queue Wait</span>
          <p className="text-xl font-bold text-blue-600 mt-1 font-mono">4.0 mins</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Under 4.5m SLA</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:border-slate-300">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Shelf Availability</span>
          <p className="text-xl font-bold text-emerald-600 mt-1 font-mono">96.5%</p>
          <span className="text-[11px] text-slate-400 font-medium">Target: 95.0%</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:border-slate-300">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Staff Efficiency</span>
          <p className="text-xl font-bold text-slate-900 mt-1 font-mono">91.8%</p>
          <span className="text-[11px] text-blue-600 font-semibold">High tier</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:border-slate-300">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">CSAT Score</span>
          <p className="text-xl font-bold text-amber-600 mt-1 font-mono">4.6 / 5.0</p>
          <span className="text-[11px] text-slate-400 font-medium">1,420 ratings</span>
        </div>
      </div>

      {/* Trend Navigation Filter Pills (Interactive) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 print:hidden">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1">
          Trend Views:
        </span>
        <button
          type="button"
          onClick={() => setTrendView('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
            trendView === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All 4 Trend Views (Grid)
        </button>
        <button
          type="button"
          onClick={() => setTrendView('footfall')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            trendView === 'footfall'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Footfall Trends
        </button>
        <button
          type="button"
          onClick={() => setTrendView('queue')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            trendView === 'queue'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Queue Trends
        </button>
        <button
          type="button"
          onClick={() => setTrendView('inventory')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            trendView === 'inventory'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Package className="h-3.5 w-3.5" />
          Inventory Trends
        </button>
        <button
          type="button"
          onClick={() => setTrendView('kpis')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            trendView === 'kpis'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Percent className="h-3.5 w-3.5" />
          KPI Trends
        </button>
      </div>

      {/* 4 Dedicated Operational Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Footfall Trends */}
        {(trendView === 'all' || trendView === 'footfall') && (
          <div
            id="report-footfall-trends"
            className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:border-slate-300 print:break-inside-avoid ${
              trendView === 'footfall' ? 'lg:col-span-2' : ''
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Footfall Trends ({reportType === 'daily' ? 'Daily' : 'Weekly'})
              </h3>
              <span className="text-xs text-slate-400 font-mono">Total Volume & Peaks</span>
            </div>

            <div className="h-60 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="totalFootfall" name="Total Footfall" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalTransactions" name="Completed Purchases" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 2. Queue Trends */}
        {(trendView === 'all' || trendView === 'queue') && (
          <div
            id="report-queue-trends"
            className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:border-slate-300 print:break-inside-avoid ${
              trendView === 'queue' ? 'lg:col-span-2' : ''
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-600" />
                Queue Trends & Wait Time SLA Adherence
              </h3>
              <span className="text-xs text-slate-400 font-mono">Target: &lt;4.5m</span>
            </div>

            <div className="h-60 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} unit="m" />
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
                    type="monotone"
                    dataKey="avgQueueWaitTime"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#f59e0b' }}
                    name="Avg Wait Time (mins)"
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 3. Inventory Trends */}
        {(trendView === 'all' || trendView === 'inventory') && (
          <div
            id="report-inventory-trends"
            className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:border-slate-300 print:break-inside-avoid ${
              trendView === 'inventory' ? 'lg:col-span-2' : ''
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <Package className="h-4 w-4 text-emerald-600" />
                Inventory Trends: On-Shelf Availability & Stockouts
              </h3>
              <span className="text-xs text-slate-400 font-mono">Stock Reliability</span>
            </div>

            <div className="h-60 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" domain={[90, 100]} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
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
                    dataKey="shelfAvailability"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#10b981' }}
                    name="On-Shelf Availability (%)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="stockoutIncidents"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#ef4444' }}
                    name="Stockout Incidents Count"
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 4. KPI Trends */}
        {(trendView === 'all' || trendView === 'kpis') && (
          <div
            id="report-kpi-trends"
            className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:border-slate-300 print:break-inside-avoid ${
              trendView === 'kpis' ? 'lg:col-span-2' : ''
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <Percent className="h-4 w-4 text-purple-600" />
                KPI Trends: Conversion Rate & Staff Efficiency
              </h3>
              <span className="text-xs text-slate-400 font-mono">Store Productivity</span>
            </div>

            <div className="h-60 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" domain={[70, 100]} />
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
                    type="monotone"
                    dataKey="conversionRate"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#8b5cf6' }}
                    name="Conversion Rate (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiencyIndex"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0284c7' }}
                    name="Staff Efficiency (%)"
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Operations Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print:border-slate-300">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Period Performance Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tabular breakdown of footfall, peak throughput, shelf availability, and staff efficiency metrics
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{activeData.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Period / Date</th>
                <th className="py-3 px-4">Total Footfall</th>
                <th className="py-3 px-4">Peak Hour</th>
                <th className="py-3 px-4">Conversion Rate</th>
                <th className="py-3 px-4">Transactions</th>
                <th className="py-3 px-4">Avg Queue Wait</th>
                <th className="py-3 px-4">Shelf Availability</th>
                <th className="py-3 px-4">Stockout Events</th>
                <th className="py-3 px-4">Efficiency Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {activeData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{item.date}</td>
                  <td className="py-3 px-4 font-mono">{item.totalFootfall.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-600">{item.peakHour}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-600">{item.conversionRate}%</td>
                  <td className="py-3 px-4 font-mono">{item.totalTransactions.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold ${
                        item.avgQueueWaitTime > 4.5 ? 'text-rose-600' : 'text-slate-800'
                      }`}
                    >
                      {item.avgQueueWaitTime} mins
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-600">{item.shelfAvailability}%</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.stockoutIncidents > 5
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.stockoutIncidents}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 font-mono">{item.efficiencyIndex}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

