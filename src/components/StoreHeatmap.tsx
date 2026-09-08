import React from 'react';
import { Camera, Users, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { StoreZone } from '../types/retail';
import { useRetail } from '../context/RetailContext';

interface StoreHeatmapProps {
  onZoneSelect?: (zone: StoreZone) => void;
}

export const StoreHeatmap: React.FC<StoreHeatmapProps> = ({ onZoneSelect }) => {
  const { zones, selectedZone, setSelectedZone } = useRetail();

  const handleZoneClick = (zone: StoreZone) => {
    setSelectedZone(selectedZone?.id === zone.id ? null : zone);
    if (onZoneSelect) onZoneSelect(zone);
  };

  // Color mapping based on density
  const getDensityColor = (density: StoreZone['density']) => {
    switch (density) {
      case 'congested':
        return {
          fill: 'bg-rose-500/15 fill-rose-500/20',
          stroke: 'border-rose-500 stroke-rose-500',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          label: 'Congested (>85%)',
        };
      case 'high':
        return {
          fill: 'bg-amber-500/15 fill-amber-500/20',
          stroke: 'border-amber-500 stroke-amber-500',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          label: 'High Traffic (65-85%)',
        };
      case 'moderate':
        return {
          fill: 'bg-sky-500/15 fill-sky-500/15',
          stroke: 'border-sky-500 stroke-sky-500',
          badge: 'bg-sky-100 text-sky-800 border-sky-300',
          dot: 'bg-sky-500',
          label: 'Moderate (35-65%)',
        };
      default:
        return {
          fill: 'bg-emerald-500/15 fill-emerald-500/15',
          stroke: 'border-emerald-500 stroke-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          label: 'Low (<35%)',
        };
    }
  };

  return (
    <div id="store-heatmap-container" className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Store Activity & Shopper Density</h2>
            <span className="flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
              <Sparkles className="h-3 w-3 text-blue-600" />
              Edge Spatial Vision
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time shopper spatial distribution detected by on-premise vision cameras
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Low
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Moderate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> High
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Congested
          </span>
        </div>
      </div>

      {/* Floorplan Layout View */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] bg-[#222f46] rounded-xl border border-slate-700/80 p-3 overflow-hidden shadow-inner select-none">
        {/* Floor grid effect */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Entrance Marker */}
        <div className="absolute top-2 left-6 z-10 flex items-center gap-1.5 bg-slate-900/90 text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/50 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          MAIN STORE ENTRANCE / TURNSTILES
        </div>

        {/* Checkout Marker */}
        <div className="absolute bottom-2 right-6 z-10 flex items-center gap-1.5 bg-slate-900/90 text-[10px] font-bold text-blue-400 px-2 py-0.5 rounded border border-blue-500/50 shadow-xs">
          EXIT & CHECKOUT GATES
        </div>

        {/* Zones Grid */}
        <div className="relative w-full h-full">
          {zones.map(zone => {
            const colors = getDensityColor(zone.density);
            const isSelected = selectedZone?.id === zone.id;
            const occupancyRatio = Math.round((zone.currentShoppers / zone.capacity) * 100);

            return (
              <div
                key={zone.id}
                id={`floorplan-zone-${zone.id}`}
                onClick={() => handleZoneClick(zone)}
                style={{
                  left: `${zone.coordinates.x}%`,
                  top: `${zone.coordinates.y}%`,
                  width: `${zone.coordinates.width}%`,
                  height: `${zone.coordinates.height}%`,
                }}
                className={`absolute rounded-lg border-2 p-2.5 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  colors.fill
                } ${colors.stroke} ${
                  isSelected
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-[1.02] z-20 shadow-lg'
                    : 'hover:brightness-125 z-10'
                }`}
              >
                {/* Zone Header */}
                <div className="flex items-start justify-between gap-1">
                  <div className="truncate">
                    <p className="text-[11px] sm:text-xs font-bold text-white leading-tight truncate">
                      {zone.name}
                    </p>
                    <span className="text-[9px] text-slate-300 font-mono font-medium">{zone.category}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <div
                      className={`h-2 w-2 rounded-full ${colors.dot} ${
                        zone.density === 'congested' ? 'animate-ping' : ''
                      }`}
                    />
                    <div className="hidden sm:flex items-center gap-0.5 text-[9px] text-slate-200 bg-slate-900/80 px-1 py-0.5 rounded border border-slate-700/60">
                      <Camera className="h-2.5 w-2.5 text-slate-400" />
                      <span className="font-mono">{zone.activeCameraId.split('-')[2]}</span>
                    </div>
                  </div>
                </div>

                {/* Live Shoppers & Density Bar */}
                <div className="mt-auto pt-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-100 mb-1 font-medium">
                    <span className="flex items-center gap-1 font-semibold text-white">
                      <Users className="h-3 w-3 text-slate-300" />
                      {zone.currentShoppers} / {zone.capacity}
                    </span>
                    <span className="font-mono text-[9px] text-slate-200">{occupancyRatio}%</span>
                  </div>

                  {/* Visual density mini bar */}
                  <div className="h-1.5 w-full bg-slate-900/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        zone.density === 'congested'
                          ? 'bg-rose-500'
                          : zone.density === 'high'
                          ? 'bg-amber-500'
                          : zone.density === 'moderate'
                          ? 'bg-sky-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, occupancyRatio)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Zone Deep-Dive Drawer / Panel */}
      {selectedZone ? (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">{selectedZone.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white border border-slate-300 font-mono text-slate-600">
                  {selectedZone.activeCameraId}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Zone Analysis • Category: {selectedZone.category}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedZone(null)}
              className="text-xs text-slate-500 hover:text-slate-800 self-start sm:self-auto px-2 py-1 bg-white rounded border border-slate-200"
            >
              Close Details ✕
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div className="bg-white p-3 rounded-lg border border-slate-200/70">
              <span className="text-[11px] text-slate-500 font-medium">Current Shoppers</span>
              <p className="text-lg font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Users className="h-4 w-4 text-indigo-600" />
                {selectedZone.currentShoppers}
                <span className="text-xs font-normal text-slate-400">/ {selectedZone.capacity} max</span>
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200/70">
              <span className="text-[11px] text-slate-500 font-medium">Average Dwell Time</span>
              <p className="text-lg font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Clock className="h-4 w-4 text-sky-600" />
                {selectedZone.avgDwellMinutes} mins
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200/70">
              <span className="text-[11px] text-slate-500 font-medium">On-Shelf Health</span>
              <p className="text-lg font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                {selectedZone.stockHealthPct}%
                <span className="text-[11px] font-normal text-slate-500">stocked</span>
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200/70">
              <span className="text-[11px] text-slate-500 font-medium">Top Velocity Product</span>
              <p className="text-xs font-bold text-slate-800 mt-1 truncate" title={selectedZone.topProduct}>
                {selectedZone.topProduct}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
            Click any zone on the floorplan to inspect live camera feeds, dwell times, and shelf health
          </span>
          <span className="hidden sm:inline font-mono text-[11px] text-slate-400">Edge Refresh: 4.5s</span>
        </div>
      )}
    </div>
  );
};
