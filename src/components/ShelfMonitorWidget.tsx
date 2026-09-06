import React, { useState } from 'react';
import { Package, AlertCircle, CheckCircle2, RotateCw, Camera, Sparkles } from 'lucide-react';
import { useRetail } from '../context/RetailContext';

export const ShelfMonitorWidget: React.FC = () => {
  const { shelves, restockShelf } = useRetail();
  const [filter, setFilter] = useState<'all' | 'attention' | 'in_stock'>('all');

  const filteredShelves = shelves.filter(s => {
    if (filter === 'attention') return s.status === 'out_of_stock' || s.status === 'low_stock' || s.facingIssues;
    if (filter === 'in_stock') return s.status === 'in_stock' && !s.facingIssues;
    return true;
  });

  const outOfStockCount = shelves.filter(s => s.status === 'out_of_stock').length;
  const lowStockCount = shelves.filter(s => s.status === 'low_stock').length;

  return (
    <div id="shelf-monitor-widget" className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">On-Shelf Availability & Planogram Vision</h2>
            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200 flex items-center gap-1">
              <Camera className="h-3 w-3 text-blue-600" />
              On-Device Shelf Camera
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated stock-out detection & void recognition via shelf edge vision
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md transition-all ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({shelves.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('attention')}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
              filter === 'attention' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            Needs Action ({outOfStockCount + lowStockCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('in_stock')}
            className={`px-3 py-1 rounded-md transition-all ${
              filter === 'in_stock' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            In Stock
          </button>
        </div>
      </div>

      {/* Shelf Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
        {filteredShelves.map(shelf => {
          const isOOS = shelf.status === 'out_of_stock';
          const isLow = shelf.status === 'low_stock';

          return (
            <div
              key={shelf.id}
              id={`shelf-card-${shelf.id}`}
              className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all ${
                isOOS
                  ? 'bg-rose-50/50 border-rose-200 shadow-sm'
                  : isLow
                  ? 'bg-amber-50/40 border-amber-200 shadow-sm'
                  : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header: SKU & Status badge */}
                <div className="flex items-start justify-between gap-1 mb-2">
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">{shelf.sku}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isOOS
                        ? 'bg-rose-100 text-rose-800'
                        : isLow
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isOOS ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'IN STOCK'}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2" title={shelf.productName}>
                  {shelf.productName}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{shelf.category}</p>

                {/* Stock Level Progress */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 text-[11px]">Facing Units:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {shelf.currentUnits} / {shelf.capacityUnits} ({shelf.stockPercentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOOS ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(4, shelf.stockPercentage)}%` }}
                    />
                  </div>
                </div>

                {/* Facing Anomaly alert */}
                {shelf.facingIssues && (
                  <div className="mt-2.5 flex items-center gap-1.5 p-1.5 rounded-md bg-amber-100/70 text-amber-800 text-[10px] font-medium border border-amber-200">
                    <AlertCircle className="h-3 w-3 shrink-0 text-amber-600" />
                    <span>Planogram Disarrangement</span>
                  </div>
                )}
              </div>

              {/* Edge AI Metadata & Action */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Sparkles className="h-3 w-3 text-blue-500" />
                  <span className="font-mono">{Math.round(shelf.cameraConfidence * 100)}% Conf.</span>
                </div>

                {(isOOS || isLow || shelf.facingIssues) ? (
                  <button
                    type="button"
                    onClick={() => restockShelf(shelf.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    <RotateCw className="h-3 w-3" />
                    Restock
                  </button>
                ) : (
                  <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Nominal
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
