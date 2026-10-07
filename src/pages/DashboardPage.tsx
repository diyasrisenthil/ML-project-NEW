import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BarChart2,
  Calendar,
  DollarSign,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Activity,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';
import { ApiService } from '../services/api';
import { PredictionResult, AnalyticsData } from '../types/prediction';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [preds, anlys] = await Promise.all([
          ApiService.getPredictions(),
          ApiService.getAnalytics(),
        ]);
        setPredictions(preds);
        setAnalytics(anlys);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Prepare chart data from the most recent 7 campaigns
  const chartData = predictions.slice(0, 8).map((p) => ({
    name: p.campaign_name.length > 18 ? p.campaign_name.slice(0, 16) + '…' : p.campaign_name,
    fullName: p.campaign_name,
    probability: p.probability,
    category: p.inputs.category,
    risk: p.risk_level,
  }));

  const totalCount = analytics?.total_predictions ?? predictions.length;
  const successCount =
    analytics?.successful_predictions ?? predictions.filter((p) => p.probability >= 70).length;
  const avgProb =
    analytics?.avg_probability ??
    (predictions.length > 0
      ? (predictions.reduce((a, b) => a + b.probability, 0) / predictions.length).toFixed(1)
      : '0.0');
  const highRiskCount =
    analytics?.high_risk_count ?? predictions.filter((p) => p.risk_level === 'High').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Quick Action Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-[#0c1222] border border-slate-800/80 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Calibrated Decision Engine Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to CrowdFundAI+
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Predict crowdfunding campaign success using machine learning and explainable AI.
              Evaluate goal targets, temporal strategies, and backer signals before launching.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/prediction/new')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ Create New Prediction</span>
            </button>
            <button
              onClick={() => navigate('/model-insights')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700/80 transition-all cursor-pointer"
            >
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              <span>Model Insights</span>
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Statistics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Predictions */}
        <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-md hover:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Predictions</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">{totalCount}</span>
            <span className="text-xs text-slate-400 font-medium">campaigns evaluated</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-emerald-400 font-medium">Live Storage</span>
            <span>• Verified evaluations</span>
          </div>
        </div>

        {/* Successful Predictions */}
        <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-md hover:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Successful Predictions</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">{successCount}</span>
            <span className="text-xs text-slate-400 font-medium">
              ({totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-emerald-400 font-medium">≥ 70% probability</span>
            <span>cutoff</span>
          </div>
        </div>

        {/* Average Success Probability */}
        <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-md hover:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Success Probability</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-indigo-400">{avgProb}%</span>
            <span className="text-xs text-slate-400 font-medium">mean posterior</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-indigo-400 font-medium">Platt-calibrated</span>
            <span>Bayesian score</span>
          </div>
        </div>

        {/* High-Risk Campaigns */}
        <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-md hover:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">High-Risk Campaigns</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-rose-400">{highRiskCount}</span>
            <span className="text-xs text-slate-400 font-medium">
              ({totalCount > 0 ? Math.round((highRiskCount / totalCount) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-rose-400 font-medium">&lt; 45% probability</span>
            <span>requiring pivots</span>
          </div>
        </div>
      </div>

      {/* Success Probability Chart */}
      <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Recent Predictions Probability Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Posterior probability output of recent campaigns evaluated by the ML model
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300">High (≥70%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-300">Med (45-69%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="text-slate-300">Low (&lt;45%)</span>
            </div>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-white">{data.fullName}</p>
                        <p className="text-slate-400">Category: {data.category}</p>
                        <p className="font-mono text-indigo-400 font-semibold">
                          Probability: {data.probability.toFixed(1)}%
                        </p>
                        <p className="text-slate-300">Risk Assessment: {data.risk}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={70} stroke="#10b981" strokeDasharray="4 4" opacity={0.6} />
              <ReferenceLine y={45} stroke="#f59e0b" strokeDasharray="4 4" opacity={0.6} />
              <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => {
                  const color =
                    entry.probability >= 70
                      ? '#10b981'
                      : entry.probability >= 45
                      ? '#f59e0b'
                      : '#ef4444';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Predictions Table */}
      <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Recent Predictions</h3>
            <p className="text-xs text-slate-400">
              Latest crowdfunding campaign evaluations with risk classifications
            </p>
          </div>
          <button
            onClick={() => navigate('/predictions')}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Goal</th>
                <th className="py-3 px-4 text-center">Success Probability</th>
                <th className="py-3 px-4">Prediction</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
              {predictions.slice(0, 6).map((p) => {
                const probColor =
                  p.probability >= 70
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : p.probability >= 45
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-white max-w-[200px] truncate">
                      {p.campaign_name}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                        {p.inputs.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-200">
                      ${p.inputs.goal.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block font-mono font-bold px-2.5 py-0.5 rounded-full border text-xs ${probColor}`}
                      >
                        {p.probability.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-300">
                        {p.prediction === 'High Probability of Success'
                          ? 'High Probability'
                          : p.prediction === 'Moderate Probability of Success'
                          ? 'Moderate'
                          : 'High Risk'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(p.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => navigate(`/predictions?view=${p.id}`)}
                        className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
