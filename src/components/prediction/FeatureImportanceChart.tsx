import React from 'react';
import { FeatureImpact } from '../../types/prediction';
import { TrendingUp, TrendingDown, HelpCircle, Cpu } from 'lucide-react';

interface FeatureImportanceChartProps {
  features: FeatureImpact[];
  summaryText: string;
}

export const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({
  features,
  summaryText,
}) => {
  // Take top 7 most impactful features
  const displayFeatures = features.slice(0, 7);
  const maxImpact = Math.max(...displayFeatures.map((f) => Math.abs(f.impact)), 25);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">Why this prediction?</h4>
            <p className="text-xs text-slate-400">
              SHAP-calibrated marginal feature attribution breakdown
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          Ensemble Tree Weights
        </span>
      </div>

      {/* Summary highlight */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
        <span className="font-semibold text-indigo-300">Model Interpretation: </span>
        {summaryText}
      </div>

      {/* Feature impact list */}
      <div className="space-y-3">
        {displayFeatures.map((feat) => {
          const widthPercent = Math.min((Math.abs(feat.impact) / maxImpact) * 100, 100);
          return (
            <div
              key={feat.feature}
              className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5 font-medium text-slate-200">
                  {feat.positive ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                  <span>{feat.label}</span>
                </div>
                <div
                  className={`font-mono font-bold ${
                    feat.positive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {feat.positive ? `+${feat.impact}%` : `${feat.impact}%`}
                </div>
              </div>

              {/* Progress track */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    feat.positive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : 'bg-gradient-to-r from-rose-500 to-amber-500'
                  }`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>

              {/* Description */}
              <p className="mt-1.5 text-[11px] text-slate-400 leading-tight">
                {feat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footnote */}
      <p className="text-[10px] text-slate-400 italic">
        * Feature impacts reflect marginal log-odds contribution derived from Random Forest feature importance and Platt scaling.
      </p>
    </div>
  );
};
