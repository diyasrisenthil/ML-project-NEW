import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  History,
  BarChart3,
  BrainCircuit,
  Info,
  Settings,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface SidebarProps {
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenSettings,
  onOpenProfile,
  isOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'New Prediction', path: '/prediction/new', icon: Sparkles, highlight: true },
    { name: 'Prediction History', path: '/predictions', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Model Insights', path: '/model-insights', icon: BrainCircuit },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0c1222] border-r border-slate-800/80 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-800/70">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <TrendingUp className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white font-sans">
                CrowdFund<span className="text-indigo-400">AI</span>
                <span className="text-purple-400 text-base">+</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              FinTech Success Engine
            </p>
          </div>
        </div>

        {/* System Model Status Badge */}
        <div className="mx-4 my-3 px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-mono font-medium text-slate-300">ML Engine v1.4-RF</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
            CALIBRATED
          </span>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <p className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Platform Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.highlight && (
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-600 text-white shadow-sm">
                    New
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 bg-[#090e1a]/80">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-3 w-full px-3 py-2 text-xs font-medium text-slate-400 rounded-lg hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Parameters</span>
          </button>

          {/* User Profile Card */}
          <div
            onClick={onOpenProfile}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-bold text-xs">
              FA
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-slate-200 truncate">FinTech Analyst</p>
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-400 truncate">research@crowdfundai.edu</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
