import React from 'react';
import { UserCheck, Clock, Users, PlusCircle, AlertTriangle } from 'lucide-react';
import { useRetail } from '../context/RetailContext';

export const QueueOverviewWidget: React.FC = () => {
  const { counters, toggleCounter, kpis } = useRetail();

  const openCount = counters.filter(c => c.status === 'open' || c.status === 'express').length;
  const totalInQueue = counters.reduce((acc, c) => acc + c.queueLength, 0);

  return (
    <div id="queue-overview-widget" className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Proactive Queue & Checkout Management</h2>
            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
              Edge Vision Tracking
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time queue depth & cashier throughput powered by overhead camera analytics
          </p>
        </div>

        {/* Quick summary pills */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
            <Users className="h-3.5 w-3.5 text-slate-500" />
            <span className="font-semibold text-slate-800">{totalInQueue}</span>
            <span className="text-slate-500">Shoppers Waiting</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${
              kpis.avgQueueTimeMinutes > 4.5
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span className="font-bold">{kpis.avgQueueTimeMinutes}m</span>
            <span>Avg Wait (SLA: 4.5m)</span>
          </div>
        </div>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mt-4">
        {counters.map(counter => {
          const isClosed = counter.status === 'closed';
          const isHighWait = counter.estimatedWaitMinutes > 4.5;

          return (
            <div
              key={counter.id}
              id={`counter-card-${counter.id}`}
              className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all ${
                isClosed
                  ? 'bg-slate-50/80 border-slate-200/60 opacity-80'
                  : isHighWait
                  ? 'bg-rose-50/40 border-rose-200 shadow-sm'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                      {counter.name.split('(')[0]}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {counter.status === 'express' ? 'Express (<5 items)' : counter.name.includes('Self') ? 'Self-Service' : 'Standard Billing'}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isClosed
                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                        : counter.status === 'express'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {counter.status.toUpperCase()}
                  </span>
                </div>

                {!isClosed ? (
                  <div className="mt-3 space-y-2">
                    {/* Visual Queue avatars */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 font-medium">Queue Length:</span>
                        <span className="font-bold text-slate-900">{counter.queueLength} customers</span>
                      </div>
                      <div className="flex items-center gap-1 overflow-hidden py-1">
                        {Array.from({ length: Math.min(8, counter.queueLength) }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-xs ${
                              idx < 2 ? 'bg-blue-600' : idx < 5 ? 'bg-blue-400' : 'bg-rose-500'
                            }`}
                          >
                            👤
                          </div>
                        ))}
                        {counter.queueLength > 8 && (
                          <span className="text-[10px] font-bold text-slate-500 ml-1">
                            +{counter.queueLength - 8}
                          </span>
                        )}
                        {counter.queueLength === 0 && (
                          <span className="text-xs text-slate-400 italic">No line</span>
                        )}
                      </div>
                    </div>

                    {/* Wait Time */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Est. Wait:
                      </span>
                      <span
                        className={`font-bold font-mono ${
                          isHighWait ? 'text-rose-600' : 'text-slate-800'
                        }`}
                      >
                        {counter.estimatedWaitMinutes} mins
                      </span>
                    </div>

                    {/* Staff Name */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 truncate">
                        <UserCheck className="h-3 w-3 text-slate-400" />
                        {counter.cashierName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {counter.throughputPerMinute} cust/min
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="my-5 text-center py-2">
                    <p className="text-xs text-slate-500 font-medium">Counter Standby</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ready for instant deployment</p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-3 pt-2 border-t border-slate-100">
                {isClosed ? (
                  <button
                    type="button"
                    onClick={() => toggleCounter(counter.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Open Counter
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleCounter(counter.id)}
                    className="w-full py-1 px-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md text-[11px] font-medium transition-colors"
                  >
                    Close / Pause Counter
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Proactive Recommendation Banner */}
      {counters.find(c => c.id === 'counter-4')?.status === 'closed' && (
        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Edge AI Staffing Recommendation:</span> Counter 2 & 3
              experiencing peak wait ({kpis.avgQueueTimeMinutes}m). Deploy backup cashier to Counter 4 to prevent customer churn.
            </div>
          </div>
          <button
            type="button"
            onClick={() => toggleCounter('counter-4')}
            className="self-start sm:self-auto px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-md shrink-0 transition-colors shadow-xs"
          >
            Deploy Counter 4 Now
          </button>
        </div>
      )}
    </div>
  );
};
