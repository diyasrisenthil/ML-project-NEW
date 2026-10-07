import React from 'react';
import { Recommendation } from '../../types/prediction';
import { Lightbulb, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface RecommendationsCardProps {
  recommendations: Recommendation[];
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
        Campaign parameters are well-balanced. Maintain rigorous backer communication.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">How to Improve Your Campaign</h4>
            <p className="text-xs text-slate-400">
              Data-backed tactical optimizations to maximize funding velocity
            </p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          {recommendations.length} Action Items
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => {
          const priorityBadge =
            rec.priority === 'high'
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              : rec.priority === 'medium'
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-blue-500/10 text-blue-300 border-blue-500/30';

          return (
            <div
              key={rec.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-slate-200">{rec.title}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${priorityBadge}`}>
                    {rec.priority} Priority
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                {rec.action}
              </p>

              <div className="flex items-center justify-between pl-6 pt-1 text-[11px]">
                <span className="text-slate-400 font-medium">Domain: {rec.category}</span>
                <span className="inline-flex items-center gap-1 font-mono font-semibold text-emerald-400">
                  <ArrowUpRight className="w-3 h-3" />
                  {rec.potential_impact}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
