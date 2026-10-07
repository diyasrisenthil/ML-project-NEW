import React from 'react';
import { PredictionResult } from '../../types/prediction';
import { CircularGauge } from './CircularGauge';
import { FeatureImportanceChart } from './FeatureImportanceChart';
import { RecommendationsCard } from './RecommendationsCard';
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Gauge,
  Percent,
  CheckCircle,
  FileText,
  Calendar,
  DollarSign,
  Tag,
  ArrowRight,
  Share2,
  Printer,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PredictionResultCardProps {
  result: PredictionResult;
  onReset?: () => void;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  result,
  onReset,
}) => {
  const navigate = useNavigate();

  // Probability bracket highlight calculation
  const isLowZone = result.probability < 45;
  const isMediumZone = result.probability >= 45 && result.probability < 70;
  const isHighZone = result.probability >= 70;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Evaluation ID: {result.id.slice(0, 14)}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(result.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">{result.campaign_name}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              {result.inputs.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Goal: ${result.inputs.goal.toLocaleString()} {result.inputs.currency}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Duration: {result.inputs.duration} Days
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <span>+ New Test</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Prediction Scoreboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Gauge & High-level Verdict */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0b101d] border border-slate-800/90 shadow-xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Machine Learning Verdict
          </span>

          <CircularGauge probability={result.probability} size={210} strokeWidth={16} />

          <div className="space-y-1">
            <h3
              className={`text-lg font-extrabold tracking-tight ${
                result.probability >= 70
                  ? 'text-emerald-400'
                  : result.probability >= 45
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              PREDICTION: {result.prediction.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Based on empirical Bayesian-calibrated Random Forest decision trees.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 w-full pt-4 border-t border-slate-800/80">
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                Probability
              </span>
              <span className="text-base font-bold font-mono text-white">
                {result.probability.toFixed(1)}%
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                Risk Level
              </span>
              <span
                className={`text-base font-bold font-mono ${
                  result.risk_level === 'Low'
                    ? 'text-emerald-400'
                    : result.risk_level === 'Medium'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {result.risk_level}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                Confidence
              </span>
              <span className="text-base font-bold font-mono text-indigo-400">
                {result.confidence}%
              </span>
            </div>
          </div>
        </div>

        {/* Right: Probability Scale & Feature Impact Highlight */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-2xl bg-[#0c1222] border border-slate-800/90 shadow-xl space-y-6">
          {/* Probability Scale Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Continuous Probability Spectrum</span>
              <span className="text-slate-400 font-mono">0.0% — 100.0%</span>
            </div>

            {/* Tri-Zone Progress Bar */}
            <div className="relative h-6 w-full rounded-xl overflow-hidden flex p-1 bg-slate-950 border border-slate-800">
              <div
                className={`w-[45%] rounded-l-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                  isLowZone
                    ? 'bg-rose-500/40 text-rose-200 border border-rose-500/50 shadow-inner'
                    : 'bg-rose-950/20 text-rose-500/60'
                }`}
              >
                LOW (0 - 44%)
              </div>
              <div
                className={`w-[25%] flex items-center justify-center text-[10px] font-bold transition-all ${
                  isMediumZone
                    ? 'bg-amber-500/40 text-amber-200 border border-amber-500/50 shadow-inner'
                    : 'bg-amber-950/20 text-amber-500/60'
                }`}
              >
                MEDIUM (45 - 69%)
              </div>
              <div
                className={`w-[30%] rounded-r-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                  isHighZone
                    ? 'bg-emerald-500/40 text-emerald-200 border border-emerald-500/50 shadow-inner'
                    : 'bg-emerald-950/20 text-emerald-500/60'
                }`}
              >
                HIGH (70 - 100%)
              </div>

              {/* Exact Pointer Needle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-700"
                style={{ left: `${Math.min(Math.max(result.probability, 2), 98)}%` }}
              >
                <div className="w-3 h-3 -ml-1 -top-1 bg-white rounded-full shadow-md" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Severe Risk of Underfunding</span>
              <span className="text-indigo-300 font-medium font-mono">
                Current: {result.probability.toFixed(1)}% ({result.risk_level} Risk)
              </span>
              <span>Optimal Launch Profile</span>
            </div>
          </div>

          {/* Key Drivers Summary Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Top Influencing Factors
            </h4>
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Factor</th>
                    <th className="py-2 px-3">Input Value</th>
                    <th className="py-2 px-3 text-right">Marginal Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono">
                  {result.feature_importance.slice(0, 4).map((f) => (
                    <tr key={f.feature} className="hover:bg-slate-850/50">
                      <td className="py-2 px-3 font-sans text-slate-200">{f.label}</td>
                      <td className="py-2 px-3 text-slate-400 text-[11px]">
                        {f.feature === 'goal'
                          ? `$${result.inputs.goal.toLocaleString()}`
                          : f.feature === 'duration'
                          ? `${result.inputs.duration} days`
                          : f.feature === 'creator_experience'
                          ? result.inputs.creator_experience
                          : f.feature === 'video'
                          ? result.inputs.video
                            ? 'Yes (Included)'
                            : 'No'
                          : f.feature === 'community_size'
                          ? result.inputs.community_size
                          : 'Configured'}
                      </td>
                      <td
                        className={`py-2 px-3 text-right font-bold ${
                          f.positive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {f.positive ? `+${f.impact}%` : `${f.impact}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Model Specification Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <span>Model: {result.model_metadata.algorithm}</span>
            <span className="font-mono text-indigo-400">
              AUC: {result.model_metadata.metrics.roc_auc}
            </span>
          </div>
        </div>
      </div>

      {/* Deep Explainable AI Section */}
      <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800 shadow-xl">
        <FeatureImportanceChart
          features={result.feature_importance}
          summaryText={result.explanation_summary}
        />
      </div>

      {/* Dynamic Actionable Recommendations */}
      <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800 shadow-xl">
        <RecommendationsCard recommendations={result.recommendations} />
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 print:hidden">
        <div className="text-xs text-slate-400">
          This prediction is preserved in your history record.
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/predictions')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <span>View All in History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <span>Explore Dataset Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};
