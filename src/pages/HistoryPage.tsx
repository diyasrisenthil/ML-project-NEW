import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Calendar,
  X,
  FileSpreadsheet,
  AlertTriangle,
  ArrowUpDown,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { PredictionResult, CampaignCategory, RiskLevel } from '../types/prediction';
import { PredictionResultCard } from '../components/prediction/PredictionResultCard';

const CATEGORIES: string[] = [
  'All',
  'Technology',
  'Design',
  'Games',
  'Film & Video',
  'Music',
  'Food',
  'Fashion',
  'Publishing',
  'Art',
  'Other',
];

const RISKS: string[] = ['All', 'Low', 'Medium', 'High'];

export const HistoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortField, setSortField] = useState<'date' | 'probability' | 'goal'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Load predictions
  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getPredictions({
        search,
        category: categoryFilter,
        risk: riskFilter,
      });
      setPredictions(data);

      // Check if view query param was set
      const viewId = searchParams.get('view');
      if (viewId) {
        const found = data.find((p) => p.id === viewId);
        if (found) setSelectedPrediction(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [categoryFilter, riskFilter]);

  // Handle live search with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchList();
    }, 250);
    return () => clearTimeout(handler);
  }, [search]);

  // Sorting
  const sortedPredictions = [...predictions].sort((a, b) => {
    if (sortField === 'date') {
      const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return sortAsc ? -diff : diff;
    }
    if (sortField === 'probability') {
      const diff = b.probability - a.probability;
      return sortAsc ? -diff : diff;
    }
    if (sortField === 'goal') {
      const diff = b.inputs.goal - a.inputs.goal;
      return sortAsc ? -diff : diff;
    }
    return 0;
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this prediction from historical database?')) return;
    await ApiService.deletePrediction(id);
    if (selectedPrediction?.id === id) {
      setSelectedPrediction(null);
    }
    fetchList();
  };

  // Export CSV
  const handleExportCSV = () => {
    if (predictions.length === 0) return;
    const headers = [
      'ID',
      'Campaign Name',
      'Category',
      'Goal',
      'Currency',
      'Duration (Days)',
      'Success Probability (%)',
      'Prediction',
      'Risk Level',
      'Model Confidence (%)',
      'Created Date',
    ];
    const rows = predictions.map((p) => [
      p.id,
      `"${p.campaign_name.replace(/"/g, '""')}"`,
      p.inputs.category,
      p.inputs.goal,
      p.inputs.currency,
      p.inputs.duration,
      p.probability,
      `"${p.prediction}"`,
      p.risk_level,
      p.confidence,
      p.created_at,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `crowdfundai_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Prediction History</h1>
          <p className="text-xs text-slate-400 mt-1">
            Archived evaluations with machine learning risk attribution scores
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {RISKS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (sortField === 'date') setSortAsc(!sortAsc);
                else {
                  setSortField('date');
                  setSortAsc(false);
                }
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1 border ${
                sortField === 'date'
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <ArrowUpDown className="w-3 h-3" />
              <span>Date</span>
            </button>
            <button
              onClick={() => {
                if (sortField === 'probability') setSortAsc(!sortAsc);
                else {
                  setSortField('probability');
                  setSortAsc(false);
                }
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1 border ${
                sortField === 'probability'
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <ArrowUpDown className="w-3 h-3" />
              <span>Prob %</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-4">
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Goal</th>
                <th className="py-3 px-4 text-center">Probability</th>
                <th className="py-3 px-4">Prediction</th>
                <th className="py-3 px-4 text-center">Risk</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {sortedPredictions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No matching predictions found for current criteria.
                  </td>
                </tr>
              ) : (
                sortedPredictions.map((p) => {
                  const probClass =
                    p.probability >= 70
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : p.probability >= 45
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                  const riskBadge =
                    p.risk_level === 'Low'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : p.risk_level === 'Medium'
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedPrediction(p)}
                      className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                        selectedPrediction?.id === p.id ? 'bg-indigo-950/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-semibold text-white max-w-[220px] truncate">
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
                          className={`inline-block font-mono font-bold px-2.5 py-0.5 rounded-full border text-xs ${probClass}`}
                        >
                          {p.probability.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 truncate max-w-[140px]">
                        {p.prediction === 'High Probability of Success'
                          ? 'High'
                          : p.prediction === 'Moderate Probability of Success'
                          ? 'Moderate'
                          : 'High Risk'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border ${riskBadge}`}
                        >
                          {p.risk_level}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(p.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPrediction(p);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                            title="View Full Report"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(p.id, e)}
                            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Prediction Full Inspection Modal / Drawer */}
      {selectedPrediction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#090e1a] border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="sticky top-0 z-10 flex items-center justify-between pb-3 bg-[#090e1a] border-b border-slate-800">
              <span className="text-xs font-mono text-indigo-400">
                Evaluation Report Preview
              </span>
              <button
                onClick={() => setSelectedPrediction(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <PredictionResultCard result={selectedPrediction} />
          </div>
        </div>
      )}
    </div>
  );
};
