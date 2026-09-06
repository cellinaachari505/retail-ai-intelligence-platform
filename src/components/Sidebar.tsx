import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Bell,
  FileText,
  Tablet,
  Cpu,
  ShieldCheck,
  Store,
  ChevronRight,
} from 'lucide-react';
import { useRetail } from '../context/RetailContext';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { kpis, isSimulating } = useRetail();
  const location = useLocation();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Real-Time Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      badge: null,
    },
    {
      to: '/analytics',
      label: 'Shopper Analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      badge: null,
    },
    {
      to: '/alerts',
      label: 'Alert Center',
      icon: <Bell className="h-4 w-4" />,
      badge: kpis.activeAlertsCount > 0 ? kpis.activeAlertsCount : null,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      to: '/reports',
      label: 'Operational Reports',
      icon: <FileText className="h-4 w-4" />,
      badge: null,
    },
    {
      to: '/staff',
      label: 'Staff Terminal',
      icon: <Tablet className="h-4 w-4" />,
      badge: 'Touch UI',
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      isHighlight: true,
    },
  ];

  const handleLinkClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <aside
      id="main-sidebar"
      className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-[#0f172a] text-slate-300 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 flex flex-col border-r border-slate-800 shrink-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-xs">
          R
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-bold tracking-tight text-lg font-sans">
              RetailAI Pro
            </span>
            <span className="rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.2 text-[9px] font-bold text-blue-400">
              EDGE
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium truncate max-w-[130px]">
            Store Intelligence
          </p>
        </div>
      </div>

      {/* Store Context Badge */}
      <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">Bangalore Flagship</span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-mono">BLR-01</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Core Modules
        </div>

        {navItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleLinkClick}
              id={`nav-link-${item.to.replace('/', '')}`}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 rounded-md border-l-4 border-blue-500 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 rounded-md font-medium hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-blue-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== null && (
                <span
                  className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    typeof item.badge === 'number'
                      ? 'bg-red-500 text-white'
                      : item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {isActive && <ChevronRight className="h-3.5 w-3.5 text-blue-400 ml-1" />}
            </NavLink>
          );
        })}
      </nav>

      {/* Edge Architecture Hardware Status */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 m-3 rounded-lg border border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[11px] font-semibold text-slate-200">On-Device Edge AI</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
            {isSimulating ? '28 FPS' : 'PAUSED'}
          </span>
        </div>

        <div className="space-y-1 text-[10px] text-slate-400">
          <div className="flex justify-between">
            <span>Model:</span>
            <span className="text-slate-200 font-mono">YOLOv8 Edge</span>
          </div>
          <div className="flex justify-between">
            <span>Edge Nodes:</span>
            <span className="text-slate-200 font-mono">4 CAMs Active</span>
          </div>
        </div>

        <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center gap-1 text-[9px] text-emerald-400/90">
          <ShieldCheck className="h-3 w-3 shrink-0" />
          <span>Zero raw video stream to cloud</span>
        </div>
      </div>

      {/* User Info / Profile in Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-800/80">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
            SM
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">Manager-701</p>
            <p className="text-[10px] text-emerald-400 truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              System Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
