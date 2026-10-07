import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  PlusCircle,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

interface TopNavbarProps {
  onToggleMobileSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleMobileSidebar }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-[#090d16]/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="flex items-center gap-4">
        {/* Mobile toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 text-slate-400 rounded-lg lg:hidden hover:text-white hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Product tagline indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-200">CrowdFundAI+</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 hidden md:inline">Intelligent FinTech Crowdfunding Success Prediction</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* ML Engine Status */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>RF-Platt Ensemble: Active</span>
        </div>

        {/* Dataset Reference */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-xs">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Corpus: 48,250 Campaigns</span>
        </div>

        {/* Clock */}
        <span className="hidden md:inline text-xs font-mono text-slate-400">
          {currentTime}
        </span>

        {/* Quick Prediction CTA */}
        <button
          onClick={() => navigate('/prediction/new')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Prediction</span>
          <span className="sm:hidden">Predict</span>
        </button>
      </div>
    </header>
  );
};
