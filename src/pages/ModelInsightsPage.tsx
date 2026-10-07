import React, { useEffect, useState } from 'react';
import {
  BrainCircuit,
  Layers,
  ArrowRight,
  Cpu,
  Target,
  BarChart,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  GitFork,
  SlidersHorizontal,
} from 'lucide-react';
import { ApiService } from '../services/api';

export const ModelInsightsPage: React.FC = () => {
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const info = await ApiService.getModelInfo();
        setModelInfo(info);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !modelInfo) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const cm = modelInfo.confusion_matrix;
  const totalCM = cm.true_positive + cm.false_positive + cm.true_negative + cm.false_negative;

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Explainable AI & Machine Learning Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Machine Learning Model Insights
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Detailed technical breakdown of the classification pipeline, training corpus, evaluation metrics, and feature importance.
        </p>
      </div>

      {/* 1. Model Used Overview */}
      <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <GitFork className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Ensemble Classification Architecture
            </span>
            <h2 className="text-lg font-bold text-white">Random Forest Classifier + Platt Calibration</h2>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          The <strong>Random Forest model combines multiple decision trees</strong> to classify whether a crowdfunding campaign is likely to succeed. By aggregating predictions across 100 decorrelated trees trained on bootstrap samples, the ensemble resists individual feature anomalies and avoids overfitting.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Ensemble Estimators</span>
            <span className="text-base font-bold font-mono text-indigo-400">100 Trees</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Bootstrap aggregating (Bagging)</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Calibration Technique</span>
            <span className="text-base font-bold font-mono text-purple-400">Platt Scaling</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Sigmoid-transformed posterior log-odds</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Attribution Mechanism</span>
            <span className="text-base font-bold font-mono text-emerald-400">TreeSHAP Local Approximator</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Marginal feature impact calculations</p>
          </div>
        </div>
      </div>

      {/* 2. End-to-End Pipeline Visualization */}
      <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight uppercase">End-to-End Model Pipeline</h3>
          <p className="text-xs text-slate-400">Data lifecycle from creator input to calibrated explainable inference</p>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 pt-2">
          {[
            { step: '01', title: 'Campaign Data', desc: 'Raw financial, media, and creator inputs' },
            { step: '02', title: 'Data Preprocessing', desc: 'Log-transform of goal, standard scaling' },
            { step: '03', title: 'Feature Engineering', desc: 'Interaction terms and momentum ratios' },
            { step: '04', title: 'ML Model', desc: '100 Random Forest decision trees' },
            { step: '05', title: 'Probability Score', desc: 'Calibrated continuous Bayesian output' },
            { step: '06', title: 'Prediction + XAI', desc: 'Risk badge & SHAP recommendations' },
          ].map((item, idx) => (
            <div
              key={item.step}
              className="relative p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-indigo-400">{item.step}</span>
                {idx < 5 && (
                  <ArrowRight className="hidden md:block w-3 h-3 text-slate-600 -mr-2 shrink-0" />
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
              <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Input Features & Gini Importance Table */}
      <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight uppercase">
              Global Feature Importance (Gini Impurity)
            </h3>
            <p className="text-xs text-slate-400">
              Ranked predictive influence across the 48,250 campaign training dataset
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            Normalized Weights ∑ = 1.00
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 w-12 text-center">Rank</th>
                <th className="py-2.5 px-4">Feature Name</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4 text-right">Relative Weight</th>
                <th className="py-2.5 px-4 w-44">Distribution Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {(modelInfo.feature_importance || []).map((feat: any) => (
                <tr key={feat.name} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-indigo-400">
                    #{feat.rank}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-200">{feat.name}</td>
                  <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">
                    {feat.type}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-200">
                    {(feat.weight * 100).toFixed(0)}%
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${feat.weight * 100 * 3.5}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Model Evaluation & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confusion Matrix Visual */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight uppercase">Confusion Matrix</h3>
              <p className="text-xs text-slate-400">
                Evaluation on test set holdout (9,650 verified crowdfunding campaigns)
              </p>
            </div>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* True Positive */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                True Positive (TP)
              </span>
              <div className="text-2xl font-extrabold font-mono text-white">
                {cm.true_positive.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                Successfully predicted funded campaigns that succeeded.
              </p>
            </div>

            {/* False Positive */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                False Positive (FP - Type I)
              </span>
              <div className="text-2xl font-extrabold font-mono text-rose-300">
                {cm.false_positive.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                Predicted to succeed, but ended up failing to fund.
              </p>
            </div>

            {/* False Negative */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                False Negative (FN - Type II)
              </span>
              <div className="text-2xl font-extrabold font-mono text-amber-300">
                {cm.false_negative.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                Flagged as high-risk, but unexpectedly succeeded.
              </p>
            </div>

            {/* True Negative */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                True Negative (TN)
              </span>
              <div className="text-2xl font-extrabold font-mono text-white">
                {cm.true_negative.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                Correctly identified campaigns that failed to reach target.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="font-semibold text-white">Interpretation: </span>
            Low Type I error (785 out of {totalCM}) ensures creators receive prudent financial assessments rather than false confidence.
          </div>
        </div>

        {/* Classification Metrics Summary */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight uppercase">Performance Metrics</h3>
            <p className="text-xs text-slate-400">Standardized classification formulas</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-semibold">Accuracy</span>
                <span className="font-mono font-bold text-white">{modelInfo.metrics.accuracy}%</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">(TP + TN) / Total Samples</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-semibold">Precision</span>
                <span className="font-mono font-bold text-emerald-400">{modelInfo.metrics.precision}%</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">TP / (TP + FP)</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-semibold">Recall (Sensitivity)</span>
                <span className="font-mono font-bold text-indigo-400">{modelInfo.metrics.recall}%</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">TP / (TP + FN)</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-semibold">F1 Score</span>
                <span className="font-mono font-bold text-purple-400">{modelInfo.metrics.f1_score}%</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">2 × (Precision × Recall) / (Precision + Recall)</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-semibold">ROC-AUC Score</span>
                <span className="font-mono font-bold text-amber-400">{modelInfo.metrics.roc_auc}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Area under the receiver operating characteristic curve</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
