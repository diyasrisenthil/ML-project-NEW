import React from 'react';
import {
  Info,
  Target,
  Sparkles,
  Award,
  Globe2,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Code2,
  Briefcase,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
          <Info className="w-3.5 h-3.5" />
          <span>FinTech & Machine Learning Research</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          About CrowdFundAI+
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Intelligent FinTech Crowdfunding Success Prediction using Machine Learning and Explainable AI.
        </p>
      </div>

      {/* Main Mission Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0c1222] to-indigo-950/40 border border-slate-800/80 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">System Overview</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          <strong>CrowdFundAI+</strong> is an intelligent crowdfunding prediction system designed to estimate campaign success using machine learning and explainable AI.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          Every year, hundreds of thousands of independent inventors, artists, and startups launch crowdfunding campaigns on platforms such as Kickstarter and Indiegogo. Over 60% fail to reach their required funding targets, forfeiting months of preparation and capital. CrowdFundAI+ leverages empirical predictive models to diagnose potential funding bottlenecks before launch, providing creators with calibrated probability estimates and actionable, data-backed optimization recommendations.
        </p>
      </div>

      {/* Project Objectives */}
      <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Project Objectives</h3>
            <p className="text-xs text-slate-400">Core functional and analytical goals of the system</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[
            {
              title: 'Predict Campaign Success',
              desc: 'Estimate the exact posterior probability of meeting or exceeding funding targets using a calibrated Random Forest ensemble.',
            },
            {
              title: 'Identify Important Success Factors',
              desc: 'Dissect the relative impact of funding goal sizing, duration urgency, media pitches, and creator credibility.',
            },
            {
              title: 'Provide Real-Time Risk Analysis',
              desc: 'Flag early red flags (such as excessive goal-to-community ratios) before capital is committed to launch campaigns.',
            },
            {
              title: 'Help Creators Make Data-Driven Decisions',
              desc: 'Replace speculative intuition with empirical statistical insights derived from tens of thousands of past campaigns.',
            },
            {
              title: 'Improve Campaign Planning & Execution',
              desc: 'Furnish tailored, prioritized recommendations with estimated percentage lifts on campaign velocity.',
            },
            {
              title: 'Democratize Alternative Financing',
              desc: 'Provide early-stage entrepreneurs and creative innovators with institutional-grade predictive intelligence.',
            },
          ].map((obj, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <h4 className="text-xs font-bold text-white">{obj.title}</h4>
              </div>
              <p className="text-xs text-slate-400 pl-6 leading-relaxed">{obj.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* UN Sustainable Development Goals (SDGs) */}
      <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-5">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Global Impact Alignment
          </span>
          <h3 className="text-base font-bold text-white tracking-tight">
            United Nations Sustainable Development Goals (SDGs)
          </h3>
          <p className="text-xs text-slate-400">
            How CrowdFundAI+ fosters inclusive economic growth and technological innovation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* SDG 8 */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-xs font-black">
                SDG 8
              </span>
              <Briefcase className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Decent Work and Economic Growth</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Target 8.3: Promote development-oriented policies that support productive activities, decent job creation, entrepreneurship, creativity and innovation, and encourage the formalization and growth of micro-, small- and medium-sized enterprises, including through access to financial services.
            </p>
            <div className="text-[11px] text-amber-300/80 pt-1 border-t border-amber-500/20">
              CrowdFundAI+ empowers micro-entrepreneurs to secure non-dilutive crowd financing with minimized financial failure risk.
            </div>
          </div>

          {/* SDG 9 */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-950/30 to-slate-900 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-indigo-500 text-white text-xs font-black">
                SDG 9
              </span>
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Industry, Innovation and Infrastructure</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Target 9.3: Increase the access of small-scale industrial and other enterprises, in particular in developing countries, to financial services, including affordable credit, and their integration into value chains and markets.
            </p>
            <div className="text-[11px] text-indigo-300/80 pt-1 border-t border-indigo-500/20">
              By bringing explainable artificial intelligence to crowdfunding, the platform lowers technical barriers to data-driven capital raising.
            </div>
          </div>
        </div>
      </div>

      {/* Academic Review & References */}
      <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-tight">
            Academic Grounding & Literature References
          </h3>
        </div>

        <ul className="text-xs text-slate-400 space-y-2 list-disc pl-5">
          <li>
            <strong className="text-slate-200">Mollick, E. (2014):</strong> "The dynamics of crowdfunding: An exploratory study." <em>Journal of Business Venturing</em>, 29(1), 1-16. (Identified 30-day optimal duration and video impact on funding rates).
          </li>
          <li>
            <strong className="text-slate-200">Greenberg, M. D., et al. (2013):</strong> "Crowdfunding support: What drives backer participation?" <em>CHI Conference on Human Factors in Computing Systems</em>. (Social presence and update cadence correlation).
          </li>
          <li>
            <strong className="text-slate-200">Lundberg, S. M., & Lee, S. I. (2017):</strong> "A unified approach to interpreting model predictions." <em>NeurIPS 2017</em>. (SHAP Shapley Additive Explanations framework used for explainable AI attribution).
          </li>
        </ul>
      </div>
    </div>
  );
};
