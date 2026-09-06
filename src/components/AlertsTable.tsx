import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle,
  Search,
  CheckCheck,
  Sparkles,
} from 'lucide-react';
import { RetailAlert, AlertSeverity, AlertType } from '../types/retail';
import { useRetail } from '../context/RetailContext';

interface AlertsTableProps {
  compact?: boolean;
  limit?: number;
}

export const AlertsTable: React.FC<AlertsTableProps> = ({ compact = false, limit }) => {
  const { alerts, acknowledgeAlert, resolveAlert } = useRetail();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');

  const filteredAlerts = alerts
    .filter(a => {
      // Search filter
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.zone.toLowerCase().includes(searchQuery.toLowerCase());

      // Severity filter
      const matchesSeverity = severityFilter === 'all' || a.severity === severityFilter;

      // Type filter
      const matchesType = typeFilter === 'all' || a.type === typeFilter;

      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'active') matchesStatus = !a.resolved;
      else if (statusFilter === 'unacknowledged') matchesStatus = !a.acknowledged && !a.resolved;
      else if (statusFilter === 'acknowledged') matchesStatus = a.acknowledged && !a.resolved;
      else if (statusFilter === 'resolved') matchesStatus = a.resolved;

      return matchesSearch && matchesSeverity && matchesType && matchesStatus;
    })
    .slice(0, limit || alerts.length);

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 border border-rose-200">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-ping" />
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-800 border border-sky-200">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 border border-slate-200">
            LOW
          </span>
        );
    }
  };

  const getTypeLabel = (type: AlertType) => {
    switch (type) {
      case 'out_of_stock':
        return 'Out of Stock';
      case 'low_stock':
        return 'Low Stock';
      case 'long_queue':
        return 'Long Queue';
      case 'crowd_congestion':
        return 'Crowd Congestion';
      case 'shelf_anomaly':
        return 'Shelf Availability & Planogram';
      default:
        return type;
    }
  };

  return (
    <div id="alerts-table-wrapper" className="space-y-4">
      {/* Filtering Bar (unless compact mode) */}
      {!compact && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search alerts by title, description, or zone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Only</option>
              <option value="medium">Medium Only</option>
              <option value="low">Low Only</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Incident Types</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="long_queue">Long Queue</option>
              <option value="crowd_congestion">Crowd Congestion</option>
              <option value="shelf_anomaly">Shelf Availability / Planogram</option>
            </select>

            {/* Status Tabs */}
            <div className="flex bg-slate-100 p-0.5 rounded-md text-xs font-semibold">
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1.5 rounded transition-all ${
                  statusFilter === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('unacknowledged')}
                className={`px-2.5 py-1.5 rounded transition-all ${
                  statusFilter === 'unacknowledged' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Pending Ack
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('resolved')}
                className={`px-2.5 py-1.5 rounded transition-all ${
                  statusFilter === 'resolved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-2.5">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
            <CheckCheck className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No alerts match the selected criteria</p>
            <p className="text-xs text-slate-500 mt-1">All store edge telemetry is within normal operational parameters.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'critical';
            const isHigh = alert.severity === 'high';

            return (
              <div
                key={alert.id}
                id={`alert-row-${alert.id}`}
                className={`bg-white rounded-xl border p-4 transition-all shadow-sm ${
                  alert.resolved
                    ? 'border-slate-200/60 opacity-60 bg-slate-50/50'
                    : isCritical
                    ? 'border-rose-200 border-l-4 border-l-rose-500'
                    : isHigh
                    ? 'border-amber-200 border-l-4 border-l-amber-500'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 p-2 rounded-lg shrink-0 ${
                        isCritical
                          ? 'bg-rose-100 text-rose-700'
                          : isHigh
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isCritical ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {getSeverityBadge(alert.severity)}
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {getTypeLabel(alert.type)}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">ID: {alert.id}</span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{alert.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">{alert.description}</p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Location: {alert.zone}</span>
                        <span className="flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono">
                          <Sparkles className="h-3 w-3 text-blue-600" />
                          Edge Confidence: {Math.round(alert.edgeConfidence * 100)}%
                        </span>

                        {alert.acknowledged && (
                          <span className="text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                            ✓ Acknowledged by {alert.acknowledgedBy || 'Staff'} ({alert.acknowledgedAt || 'Recently'})
                          </span>
                        )}

                        {alert.resolved && (
                          <span className="text-slate-600 font-medium bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                            Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 self-end sm:self-start">
                    {!alert.acknowledged && !alert.resolved && (
                      <button
                        type="button"
                        onClick={() => acknowledgeAlert(alert.id, 'Floor Staff')}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-colors shadow-xs"
                      >
                        Acknowledge
                      </button>
                    )}

                    {!alert.resolved && (
                      <button
                        type="button"
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-md text-xs font-semibold transition-colors border border-slate-200"
                      >
                        <CheckCircle className="h-3.5 w-3.5 inline mr-1" />
                        Resolve
                      </button>
                    )}

                    {alert.resolved && (
                      <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                        <CheckCheck className="h-4 w-4" /> Incident Closed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
