import React, { useState } from 'react';
import { X, Sliders, Database, RotateCcw, Check, Sparkles } from 'lucide-react';
import { ApiService } from '../../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [resetSuccess, setResetSuccess] = useState(false);
  const [thresholdHigh, setThresholdHigh] = useState('70');
  const [thresholdMed, setThresholdMed] = useState('45');

  if (!isOpen) return null;

  const handleResetData = async () => {
    await ApiService.resetData();
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      window.location.reload();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0d1424] border border-slate-800 shadow-2xl p-6 text-slate-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">System Settings</h2>
              <p className="text-xs text-slate-400">Configure ML parameters and storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Parameters */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Model Inference Thresholds
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">High Probability Cutoff</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={thresholdHigh}
                  onChange={(e) => setThresholdHigh(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-xs text-slate-400">%</span>
              </div>
              <p className="text-[10px] text-slate-400">Campaigns above this marked as Low Risk</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Moderate Probability Cutoff</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={thresholdMed}
                  onChange={(e) => setThresholdMed(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-mono text-amber-400 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-xs text-slate-400">%</span>
              </div>
              <p className="text-[10px] text-slate-400">Campaigns below this marked as High Risk</p>
            </div>
          </div>
        </div>

        {/* Algorithm details */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Ensemble Architecture:</span>
            <span className="font-mono font-medium text-indigo-300">Random Forest (100 Trees)</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Probability Calibration:</span>
            <span className="font-mono font-medium text-purple-300">Platt Scaling (Sigmoid)</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Attribution Method:</span>
            <span className="font-mono font-medium text-emerald-300">SHAP-based Feature Impact</span>
          </div>
        </div>

        {/* Database Management */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Storage & Sample Data
          </h3>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Reset Demo Corpus</p>
                <p className="text-[11px] text-slate-400">
                  Restore pre-loaded Kickstarter & Indiegogo predictions
                </p>
              </div>
            </div>
            <button
              onClick={handleResetData}
              disabled={resetSuccess}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                resetSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {resetSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Restored!</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Data</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
