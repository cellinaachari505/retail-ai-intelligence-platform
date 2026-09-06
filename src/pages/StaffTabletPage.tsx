import React, { useState } from 'react';
import {
  Tablet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlusCircle,
  RotateCw,
  Sparkles,
  Users,
  CheckCheck,
  ChevronRight,
  UserCheck,
  LogOut,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { useRetail } from '../context/RetailContext';
import { useNavigate } from 'react-router-dom';

export const StaffTabletPage: React.FC = () => {
  const {
    counters,
    alerts,
    shelves,
    recommendations,
    acknowledgeAlert,
    resolveAlert,
    toggleCounter,
    applyRecommendation,
    refreshRecommendations,
    restockShelf,
    kpis,
  } = useRetail();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'queues' | 'alerts' | 'restock'>('overview');
  const [selectedStaff, setSelectedStaff] = useState('Rajesh Kumar (Associate)');
  const [executingRecId, setExecutingRecId] = useState<string | null>(null);

  const activeAlerts = alerts.filter(a => !a.resolved);
  const outOfStockShelves = shelves.filter(s => s.status === 'out_of_stock' || s.status === 'low_stock');

  // Recommendation queue derivation
  const pendingRecommendations = recommendations.filter(r => !r.applied);
  const activeRecommendation = executingRecId
    ? recommendations.find(r => r.id === executingRecId) || pendingRecommendations[0]
    : pendingRecommendations[0];
  const isSuccessState = executingRecId !== null && activeRecommendation?.id === executingRecId;

  const handleExecuteRecommendation = (recId: string) => {
    if (executingRecId) return;

    // 1. Immediately show success state
    setExecutingRecId(recId);

    // 2. Actually update relevant mock frontend state
    applyRecommendation(recId);

    // 3. Automatically advance to next recommendation after a short delay
    setTimeout(() => {
      setExecutingRecId(null);
    }, 1200);
  };

  const handleRefreshRecommendations = () => {
    setExecutingRecId(null);
    refreshRecommendations();
  };

  return (
    <div id="staff-tablet-interface" className="space-y-6 pb-16 select-none">
      {/* Tablet Top Mode Bar */}
      <div className="bg-[#0f172a] text-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Tablet className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">Staff Floor Terminal</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold ring-1 ring-emerald-500/30">
                Touch Mode Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Assigned Associate: <strong className="text-slate-200">{selectedStaff}</strong> • Zone: Apparel & Billing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-bold transition-colors border border-slate-700"
          >
            <LogOut className="h-4 w-4" />
            Exit to Manager Dashboard
          </button>
        </div>
      </div>

      {/* Touch-First Navigation Tabs (Large touch targets) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`min-h-[50px] p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Sparkles className="h-5 w-5" />
          <span>Quick Actions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('queues')}
          className={`min-h-[50px] p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
            activeTab === 'queues'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Queue Status</span>
          <span className="bg-slate-800 text-white text-xs px-2 py-0.5 rounded-full ml-1 font-mono">
            {counters.filter(c => c.status === 'open' || c.status === 'express').length} Open
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`min-h-[50px] p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm relative ${
            activeTab === 'alerts'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Bell className="h-5 w-5" />
          <span>Floor Alerts</span>
          {activeAlerts.length > 0 && (
            <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full ml-1 font-mono font-bold animate-pulse">
              {activeAlerts.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('restock')}
          className={`min-h-[50px] p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
            activeTab === 'restock'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <RotateCw className="h-5 w-5" />
          <span>Shelf Restock</span>
          <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full ml-1 font-mono">
            {outOfStockShelves.length}
          </span>
        </button>
      </div>

      {/* AI Staffing Recommendation Callout (Continuous Queue) */}
      {activeRecommendation ? (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-400/80 rounded-2xl p-4 sm:p-5 bg-white shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    AI Edge Staffing Advisor
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Updated Just Now</span>
                  <span className="text-xs font-semibold text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full font-mono">
                    {pendingRecommendations.length} {pendingRecommendations.length === 1 ? 'recommendation' : 'recommendations'} remaining
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {activeRecommendation.action}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                  {activeRecommendation.reason}
                </p>
              </div>
            </div>

            <button
              type="button"
              id="execute-recommendation-btn"
              disabled={isSuccessState}
              onClick={() => handleExecuteRecommendation(activeRecommendation.id)}
              className={`min-h-[48px] px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shrink-0 shadow-md ${
                isSuccessState
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95'
              }`}
            >
              {isSuccessState ? (
                <>
                  <CheckCheck className="h-5 w-5" />
                  <span>✓ Recommendation executed successfully</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5" />
                  <span>Execute Recommendation</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-400/80 rounded-2xl p-4 sm:p-5 bg-white shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    AI Edge Staffing Advisor
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Status: Optimal</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  ✓ All current recommendations have been addressed.
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                  Store operations and floor coverage are currently within SLA thresholds. Tap refresh to re-evaluate real-time floor conditions.
                </p>
              </div>
            </div>

            <button
              type="button"
              id="refresh-recommendations-btn"
              onClick={handleRefreshRecommendations}
              className="min-h-[48px] px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white active:scale-95 transition-all shrink-0 shadow-md"
            >
              <RotateCw className="h-4 w-4" />
              <span>Refresh AI Recommendations</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Touch Content Area */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Counter Control (Large Buttons) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Checkout Queue Controls
              </h3>
              <span className="text-xs text-slate-500 font-medium">Touch to Toggle</span>
            </div>

            <div className="space-y-3 mt-4">
              {counters.map(c => {
                const isOpen = c.status === 'open' || c.status === 'express';
                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                      isOpen
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-slate-100/60 border-dashed border-slate-300 opacity-80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                            isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {c.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {isOpen ? (
                          <>
                            Queue: <strong className="text-slate-900 font-mono">{c.queueLength}</strong> customers • Wait: <strong className="text-slate-900 font-mono">{c.estimatedWaitMinutes}m</strong>
                          </>
                        ) : (
                          'Ready to open on demand'
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleCounter(c.id)}
                      className={`min-h-[46px] px-4 py-2.5 rounded-md font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                        isOpen
                          ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isOpen ? 'Close Counter' : 'Open Counter'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critical Alerts with 1-Tap Acknowledge */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                  Immediate Floor Alerts
                </h3>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  {activeAlerts.length} Unresolved
                </span>
              </div>

              <div className="space-y-3 mt-4">
                {activeAlerts.slice(0, 3).map(alert => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      alert.severity === 'critical'
                        ? 'bg-rose-50/60 border-rose-200'
                        : 'bg-amber-50/60 border-amber-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            alert.severity === 'critical'
                              ? 'bg-rose-200 text-rose-800'
                              : 'bg-amber-200 text-amber-800'
                          }`}
                        >
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{alert.title}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{alert.zone}</p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {!alert.acknowledged ? (
                        <button
                          type="button"
                          onClick={() => acknowledgeAlert(alert.id, selectedStaff)}
                          className="flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-xs active:scale-95 transition-all"
                        >
                          1-Tap Acknowledge
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => resolveAlert(alert.id)}
                          className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold shadow-xs active:scale-95 transition-all"
                        >
                          Mark Resolved ✓
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('alerts')}
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-blue-600 flex items-center justify-center gap-1 hover:text-blue-800"
            >
              View Full Incident Queue ({activeAlerts.length}) <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Queues Tab */}
      {activeTab === 'queues' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Checkout Terminal Management</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitor and open backup counters directly with 1 tap
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleCounter('counter-4')}
              className="min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Toggle Counter 4 (Backup)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {counters.map(counter => {
              const isOpen = counter.status === 'open' || counter.status === 'express';
              return (
                <div
                  key={counter.id}
                  className={`p-5 rounded-xl border flex flex-col justify-between ${
                    isOpen ? 'bg-slate-50 border-slate-200' : 'bg-slate-100/60 border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{counter.name}</span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {counter.status.toUpperCase()}
                      </span>
                    </div>

                    {isOpen ? (
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500 font-medium">Queue:</span>
                          <span className="text-base font-bold text-slate-900 font-mono">
                            {counter.queueLength} customers
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500 font-medium">Est Wait:</span>
                          <span
                            className={`text-base font-bold font-mono ${
                              counter.estimatedWaitMinutes > 4.5 ? 'text-rose-600' : 'text-slate-900'
                            }`}
                          >
                            {counter.estimatedWaitMinutes} mins
                          </span>
                        </div>
                        <div className="flex justify-between text-xs pt-1 border-t border-slate-200/60">
                          <span className="text-slate-500 font-medium">Cashier:</span>
                          <span className="font-semibold text-slate-700">{counter.cashierName}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs text-slate-400">
                        Counter Currently Closed
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCounter(counter.id)}
                    className={`mt-4 min-h-[44px] w-full rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                      isOpen
                        ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isOpen ? 'Close Counter' : 'Open Counter'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Floor Alerts Queue</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tap acknowledge to take responsibility for an incident
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {activeAlerts.length} Pending Actions
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {activeAlerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                All floor alerts resolved.
              </div>
            ) : (
              activeAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    alert.severity === 'critical'
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          alert.severity === 'critical'
                            ? 'bg-rose-200 text-rose-800'
                            : 'bg-amber-200 text-amber-800'
                        }`}
                      >
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{alert.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl">{alert.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                      <span>Location: <strong className="text-slate-800">{alert.zone}</strong></span>
                      <span>Time: {alert.timestamp}</span>
                      {alert.acknowledged && (
                        <span className="text-emerald-700 font-semibold">
                          ✓ Handled by {alert.acknowledgedBy}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    {!alert.acknowledged ? (
                      <button
                        type="button"
                        onClick={() => acknowledgeAlert(alert.id, selectedStaff)}
                        className="flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-xs active:scale-95 transition-all"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => resolveAlert(alert.id)}
                        className="flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold shadow-xs active:scale-95 transition-all"
                      >
                        Resolve ✓
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Restock Tab */}
      {activeTab === 'restock' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Shelves Requiring Restock</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Edge cameras identified low stock or empty facing
              </p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              {outOfStockShelves.length} Shelves
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {outOfStockShelves.map(shelf => (
              <div
                key={shelf.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{shelf.sku}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        shelf.status === 'out_of_stock'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {shelf.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug">{shelf.productName}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{shelf.category}</p>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-slate-500">Current Stock:</span>
                      <span className="font-bold text-slate-900">
                        {shelf.currentUnits} / {shelf.capacityUnits} units ({shelf.stockPercentage}%)
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => restockShelf(shelf.id)}
                  className="mt-4 min-h-[44px] w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                >
                  <RotateCw className="h-4 w-4" />
                  Mark Shelf Restocked (100%)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
