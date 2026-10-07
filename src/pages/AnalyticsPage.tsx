import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Target,
  Award,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { AnalyticsData } from '../types/prediction';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await ApiService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  // Distribution chart data
  const distributionData = [
    { name: 'High Probability (≥70%)', value: analytics.distribution.high, color: '#10b981' },
    { name: 'Medium Probability (45-69%)', value: analytics.distribution.medium, color: '#f59e0b' },
    { name: 'Low Probability (<45%)', value: analytics.distribution.low, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Crowdfunding Portfolio Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Empirical insights across evaluated campaigns and calibrated machine learning models
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Evaluation Corpus: {analytics.total_predictions} Campaigns</span>
        </div>
      </div>

      {/* Top 5 Model Performance Metrics Scoreboard */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Model Validation Metrics (Test Set Evaluation)
          </h3>
          <span className="text-[11px] text-indigo-400 font-mono">
            * Calibrated Scikit-Learn Model Benchmark (48,250 records)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-[#0c1222] border border-slate-800/80 shadow-md">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold font-mono text-white">
                {analytics.model_metrics.accuracy}%
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block">Cross-Validated 5-Fold</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0c1222] border border-slate-800/80 shadow-md">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Precision</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold font-mono text-emerald-400">
                {analytics.model_metrics.precision}%
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">True Positive Rate</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0c1222] border border-slate-800/80 shadow-md">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Recall</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold font-mono text-indigo-400">
                {analytics.model_metrics.recall}%
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Sensitivity Index</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0c1222] border border-slate-800/80 shadow-md">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">F1 Score</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold font-mono text-purple-400">
                {analytics.model_metrics.f1_score}%
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Harmonic Mean</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-[#0c1222] border border-slate-800/80 shadow-md">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">ROC-AUC</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold font-mono text-amber-400">
                {analytics.model_metrics.roc_auc}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Class Discriminator</span>
          </div>
        </div>
      </div>

      {/* Row 1: Prediction Distribution + Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Distribution Donut */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Prediction Distribution</h3>
              <p className="text-xs text-slate-400">Classification breakdown of recorded campaigns</p>
            </div>
            <PieIcon className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0c1222" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const pct = Math.round((data.value / analytics.total_predictions) * 100) || 0;
                      return (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs space-y-1">
                          <p className="font-bold text-white">{data.name}</p>
                          <p className="font-mono text-indigo-400">
                            {data.value} campaigns ({pct}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            {distributionData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-300">{d.name}</span>
                </div>
                <span className="font-mono font-semibold text-white">
                  {d.value}{' '}
                  <span className="text-slate-400 font-normal">
                    ({analytics.total_predictions > 0 ? Math.round((d.value / analytics.total_predictions) * 100) : 0}%)
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Category Success Probability</h3>
              <p className="text-xs text-slate-400">Average predicted probability by industry category</p>
            </div>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.category_performance}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" stroke="#64748b" fontSize={11} />
                <YAxis
                  dataKey="category"
                  type="category"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs space-y-1">
                          <p className="font-bold text-white">{data.category}</p>
                          <p className="font-mono text-indigo-400">
                            Avg Probability: {data.avg_probability.toFixed(1)}%
                          </p>
                          <p className="text-slate-400">Total in Corpus: {data.total_campaigns}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avg_probability" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Campaign Duration vs Probability + Goal vs Success Probability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Campaign Duration vs Probability */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Campaign Duration vs Probability</h3>
              <p className="text-xs text-slate-400">
                Empirical bell-curve: 30-day target yields maximum momentum
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics.duration_vs_probability}
                margin={{ top: 10, right: 20, left: -20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="duration_bracket" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 100]} unit="%" stroke="#64748b" fontSize={11} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs space-y-1">
                          <p className="font-bold text-white">{data.duration_bracket}</p>
                          <p className="font-mono text-emerald-400 font-semibold">
                            Avg Probability: {data.avg_probability}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avg_probability"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10b981' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal vs Probability */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Funding Goal vs Success Probability</h3>
              <p className="text-xs text-slate-400">
                Inverse logarithmic relationship as funding requirements scale
              </p>
            </div>
            <Target className="w-4 h-4 text-purple-400" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.goal_vs_probability}
                margin={{ top: 10, right: 20, left: -20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="goal_range" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 100]} unit="%" stroke="#64748b" fontSize={11} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs space-y-1">
                          <p className="font-bold text-white">Target: {data.goal_range}</p>
                          <p className="font-mono text-purple-400 font-semibold">
                            Avg Probability: {data.avg_probability}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avg_probability" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
