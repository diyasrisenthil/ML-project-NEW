import React from 'react';
import { X, ShieldCheck, Award, GraduationCap, Cpu, Database } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0d1424] border border-slate-800 shadow-2xl p-6 text-slate-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold">
              FA
            </div>
            <div>
              <h2 className="text-base font-bold text-white">FinTech Analyst Profile</h2>
              <p className="text-xs text-slate-400">Project Review & Research Console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Authenticated Role:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <ShieldCheck className="w-3 h-3" /> Lead Evaluator
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Institution / Context:</span>
            <span className="text-xs font-medium text-slate-200">Final-Year FinTech & ML Review</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Specialization:</span>
            <span className="text-xs font-medium text-slate-200">Crowdfunding Risk Attribution</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">API Access:</span>
            <span className="text-xs font-mono text-emerald-400">Full Model Predict & Train</span>
          </div>
        </div>

        {/* System Capabilities */}
        <div className="space-y-2 text-xs">
          <p className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
            Verified Research Capabilities
          </p>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="text-[11px]">Ensemble Inference</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="text-[11px]">Explainable AI (SHAP)</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px]">Academic Benchmarking</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px]">Corpus Synthesis</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
