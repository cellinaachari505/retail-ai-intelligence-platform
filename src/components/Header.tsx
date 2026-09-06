import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  Play,
  Pause,
  Zap,
  Tablet,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useRetail } from '../context/RetailContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const {
    kpis,
    alerts,
    isSimulating,
    toggleSimulation,
    triggerDemoAlert,
    acknowledgeAlert,
  } = useRetail();
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeAlerts = alerts.filter(a => !a.resolved);

  // Dynamic breadcrumb / title
  const getPageMeta = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'Store Operations Command Center', subtitle: 'Real-time telemetry and edge analytics' };
      case '/analytics':
        return { title: 'Shopper Behavior & Traffic Analytics', subtitle: 'Privacy-preserving on-device dwell & conversion flow' };
      case '/alerts':
        return { title: 'Incident & Alert Center', subtitle: 'Critical inventory, queue, and congestion alerts' };
      case '/reports':
        return { title: 'Operational Performance Reports', subtitle: 'Daily & weekly trends with export capability' };
      case '/staff':
        return { title: 'Staff Assist & Floor Tablet Mode', subtitle: 'Simplified touch-first terminal for on-ground associates' };
      default:
        return { title: 'Retail Operations Dashboard', subtitle: 'Smart India Hackathon' };
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <header
      id="main-header"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shrink-0"
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          id="mobile-menu-toggle"
          aria-label="Toggle mobile menu"
          className="lg:hidden rounded-md p-1.5 text-slate-600 hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-baseline gap-2">
          <h1 className="text-lg sm:text-xl font-semibold text-slate-800 tracking-tight">{title}</h1>
          <span className="hidden sm:inline text-slate-400 text-xs sm:text-sm font-normal">— {subtitle}</span>
        </div>
      </div>

      {/* Right: Controls & Actions */}
      <div className="flex items-center gap-3">
        {/* Status indicator pill matching design */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-xs font-medium uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Peak Hours Monitored</span>
        </div>

        {/* Real-time simulation stream toggle */}
        <button
          type="button"
          id="simulation-toggle-btn"
          onClick={toggleSimulation}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            isSimulating
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
          title="Toggle live telemetry simulation for demonstration"
        >
          {isSimulating ? (
            <>
              <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
              <span className="hidden sm:inline">Edge:</span>
              <span className="font-semibold">LIVE</span>
              <Pause className="h-3 w-3 ml-0.5 text-emerald-700" />
            </>
          ) : (
            <>
              <Play className="h-3 w-3 text-slate-600" />
              <span>Resume Stream</span>
            </>
          )}
        </button>

        {/* Demo trigger quick action */}
        <div className="relative">
          <button
            type="button"
            id="demo-trigger-btn"
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <Zap className="h-3.5 w-3.5 text-blue-600" />
            <span className="hidden sm:inline">Simulate AI</span>
            <span>Trigger</span>
          </button>

          {showDemoMenu && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-xl bg-white p-2 shadow-xl ring-1 ring-slate-900/10 z-50 animate-in fade-in zoom-in-95 duration-150 border border-slate-200"
              onClick={() => setShowDemoMenu(false)}
            >
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Hackathon Demo Triggers
              </p>
              <button
                type="button"
                id="trigger-queue-surge"
                onClick={() => triggerDemoAlert('queue')}
                className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-slate-50 flex items-center justify-between text-slate-800"
              >
                <span>⚡ Long Queue (Billing Counter)</span>
                <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">Critical</span>
              </button>
              <button
                type="button"
                id="trigger-stock-out"
                onClick={() => triggerDemoAlert('stock')}
                className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-slate-50 flex items-center justify-between text-slate-800"
              >
                <span>📦 Out of Stock (Shelf A3)</span>
                <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">Critical</span>
              </button>
              <button
                type="button"
                id="trigger-low-stock"
                onClick={() => triggerDemoAlert('low_stock')}
                className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-slate-50 flex items-center justify-between text-slate-800"
              >
                <span>📉 Low Stock (Atta 10kg)</span>
                <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">High</span>
              </button>
              <button
                type="button"
                id="trigger-crowd-congestion"
                onClick={() => triggerDemoAlert('crowd')}
                className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-slate-50 flex items-center justify-between text-slate-800"
              >
                <span>👥 Crowd Congestion (Entrance)</span>
                <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">High</span>
              </button>
              <button
                type="button"
                id="trigger-shelf-availability"
                onClick={() => triggerDemoAlert('shelf_availability')}
                className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-slate-50 flex items-center justify-between text-slate-800"
              >
                <span>🏷️ Shelf Availability / Planogram</span>
                <span className="text-[10px] text-sky-600 font-semibold bg-sky-50 px-1.5 py-0.5 rounded">Med</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            id="notification-bell-btn"
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            aria-label="View notifications"
            className="relative rounded-md p-2 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {kpis.activeAlertsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {kpis.activeAlertsCount}
              </span>
            )}
          </button>

          {showAlertsDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-xl ring-1 ring-slate-900/10 z-50 divide-y divide-slate-100 border border-slate-200">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-800">Active Real-Time Alerts</span>
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                    {activeAlerts.length} Active
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAlertsDropdown(false);
                    navigate('/alerts');
                  }}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  View All <ExternalLink className="h-3 w-3" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto p-2 space-y-2">
                {activeAlerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-1.5" />
                    All operational metrics nominal. Zero active alerts.
                  </div>
                ) : (
                  activeAlerts.slice(0, 4).map(alert => (
                    <div
                      key={alert.id}
                      className={`p-2.5 rounded-lg border text-xs ${
                        alert.severity === 'critical'
                          ? 'bg-rose-50/70 border-rose-200'
                          : alert.severity === 'high'
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <AlertTriangle
                            className={`h-3.5 w-3.5 shrink-0 ${
                              alert.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'
                            }`}
                          />
                          <span className="truncate max-w-[200px]">{alert.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">{alert.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{alert.description}</p>
                      <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-[10px] font-medium text-slate-500">{alert.zone}</span>
                        {!alert.acknowledged ? (
                          <button
                            type="button"
                            onClick={() => acknowledgeAlert(alert.id, 'Manager Sunil')}
                            className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-semibold hover:bg-slate-800"
                          >
                            Acknowledge
                          </button>
                        ) : (
                          <span className="text-[10px] font-medium text-emerald-600">✓ Acknowledged</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary CTA / Switch Mode matching Modern SaaS button */}
        {location.pathname !== '/staff' ? (
          <button
            type="button"
            id="switch-staff-tablet-btn"
            onClick={() => navigate('/staff')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Tablet className="h-4 w-4" />
            <span className="hidden sm:inline">Staff</span> Terminal
          </button>
        ) : (
          <button
            type="button"
            id="switch-manager-view-btn"
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            Dashboard View
          </button>
        )}
      </div>
    </header>
  );
};
