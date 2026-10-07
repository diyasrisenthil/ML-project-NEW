import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  HelpCircle,
  Video,
  Users,
  Target,
  Clock,
  Globe,
  Award,
  Share2,
  Gift,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import {
  CampaignInput,
  CampaignCategory,
  CreatorExperience,
  CommunitySize,
  PredictionResult,
} from '../types/prediction';
import { DEMO_SUCCESS_CAMPAIGN, DEMO_HIGH_RISK_CAMPAIGN } from '../services/mlEngine';
import { ApiService } from '../services/api';
import { PredictionResultCard } from '../components/prediction/PredictionResultCard';

const INITIAL_FORM: CampaignInput = {
  name: '',
  category: 'Technology',
  goal: 10000,
  duration: 30,
  launch_month: 'October',
  country: 'US',
  currency: 'USD',
  creator_experience: 'Intermediate',
  previous_campaigns: 1,
  social_media: true,
  creator_verification: true,
  video: true,
  updates: 6,
  reward_available: true,
  early_bird: true,
  marketing_plan: true,
  community_size: '1,000 - 5,000',
};

const CATEGORIES: CampaignCategory[] = [
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

const EXPERIENCES: CreatorExperience[] = [
  'Beginner',
  'Intermediate',
  'Experienced',
  'Serial Entrepreneur',
];

const COMMUNITY_SIZES: CommunitySize[] = [
  'None',
  '<1,000',
  '1,000 - 5,000',
  '5,000 - 20,000',
  '20,000+',
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const NewPredictionPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<CampaignInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [result, setResult] = useState<PredictionResult | null>(null);

  // Validate form
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) {
      errs.name = 'Campaign name is required.';
    }
    if (!form.goal || form.goal <= 0) {
      errs.goal = 'Funding goal must be greater than $0.';
    } else if (form.goal > 10000000) {
      errs.goal = 'Funding goal exceeds realistic crowdfunding thresholds ($10M).';
    }
    if (!form.duration || form.duration < 1 || form.duration > 90) {
      errs.duration = 'Campaign duration must be between 1 and 90 days.';
    }
    if (form.previous_campaigns < 0) {
      errs.previous_campaigns = 'Previous campaigns cannot be negative.';
    }
    if (form.updates < 0) {
      errs.updates = 'Planned updates cannot be negative.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setLoadingStep('Ingesting campaign feature matrix...');

    try {
      // Step simulation for realistic ML inference feel
      await new Promise((r) => setTimeout(r, 350));
      setLoadingStep('Evaluating Random Forest Decision Trees (100 estimators)...');
      await new Promise((r) => setTimeout(r, 450));
      setLoadingStep('Computing Platt Scaling calibration & SHAP feature impacts...');
      await new Promise((r) => setTimeout(r, 300));

      const predictionResult = await ApiService.predict(form);
      setResult(predictionResult);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Prediction failed', err);
      alert('Prediction evaluation failed. Please verify your inputs.');
    } finally {
      setIsSubmitting(false);
      setLoadingStep('');
    }
  };

  const handleLoadDemoSuccess = () => {
    setForm({ ...DEMO_SUCCESS_CAMPAIGN });
    setErrors({});
  };

  const handleLoadDemoHighRisk = () => {
    setForm({ ...DEMO_HIGH_RISK_CAMPAIGN });
    setErrors({});
  };

  const handleResetForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setResult(null);
  };

  // If result is ready, show Result View with Option to Re-evaluate
  if (result) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Output / Inference Report
            </span>
            <h1 className="text-2xl font-extrabold text-white">Prediction Analysis Result</h1>
          </div>
          <button
            onClick={() => setResult(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Modify Campaign Parameters</span>
          </button>
        </div>

        <PredictionResultCard result={result} onReset={() => setResult(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Factor Predictive Model</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Crowdfunding Success Prediction
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Enter campaign details to estimate the probability of success using explainable machine learning.
          </p>
        </div>

        {/* Demo Load Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleLoadDemoSuccess}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Load Demo (High Success)</span>
          </button>
          <button
            type="button"
            onClick={handleLoadDemoHighRisk}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Load Demo (High Risk)</span>
          </button>
        </div>
      </div>

      {/* Main Multi-section Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Campaign Information */}
        <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">1. Campaign Information</h2>
              <p className="text-xs text-slate-400">Core financial and positioning metadata</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Campaign Name */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Campaign Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Lumio Sound — Next-Gen Acoustic Lamp"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  errors.name ? 'border-rose-500' : 'border-slate-800 hover:border-slate-700'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as CampaignCategory })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                Historical success baseline varies widely across categories (e.g. Publishing 56% vs Tech 24%).
              </p>
            </div>

            {/* Funding Goal */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Funding Goal Amount ($) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  min="1"
                  step="100"
                  value={form.goal || ''}
                  onChange={(e) =>
                    setForm({ ...form, goal: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="5000"
                  className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-900/80 border text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    errors.goal ? 'border-rose-500' : 'border-slate-800 hover:border-slate-700'
                  }`}
                />
              </div>
              {errors.goal && <p className="text-xs text-rose-400">{errors.goal}</p>}
              <p className="text-[11px] text-slate-400">
                Optimal range: $2,000 — $15,000 for non-established creators.
              </p>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Campaign Duration (Days) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={form.duration || ''}
                onChange={(e) =>
                  setForm({ ...form, duration: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="30"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  errors.duration ? 'border-rose-500' : 'border-slate-800 hover:border-slate-700'
                }`}
              />
              {errors.duration && <p className="text-xs text-rose-400">{errors.duration}</p>}
              <p className="text-[11px] text-slate-400">
                Kickstarter benchmark: 30 days yields peak momentum and pledge urgency.
              </p>
            </div>

            {/* Launch Month */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Launch Month
              </label>
              <select
                value={form.launch_month}
                onChange={(e) => setForm({ ...form, launch_month: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Origin Country
              </label>
              <select
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
              >
                <option value="US">United States (US)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="CA">Canada (CA)</option>
                <option value="DE">Germany (DE)</option>
                <option value="AU">Australia (AU)</option>
                <option value="FR">France (FR)</option>
                <option value="CH">Switzerland (CH)</option>
                <option value="JP">Japan (JP)</option>
              </select>
            </div>

            {/* Currency */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Currency
              </label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Creator Information */}
        <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">2. Creator Information</h2>
              <p className="text-xs text-slate-400">Track record, execution history, and trust factors</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Creator Experience */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Creator Experience Level
              </label>
              <select
                value={form.creator_experience}
                onChange={(e) =>
                  setForm({
                    ...form,
                    creator_experience: e.target.value as CreatorExperience,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
              >
                {EXPERIENCES.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            {/* Previous Successful Campaigns */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Previous Successful Campaigns
              </label>
              <input
                type="number"
                min="0"
                max="25"
                value={form.previous_campaigns}
                onChange={(e) =>
                  setForm({
                    ...form,
                    previous_campaigns: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <p className="text-[11px] text-slate-400">
                Prior completed deliveries heavily reduce fulfillment risk.
              </p>
            </div>

            {/* Social Media Presence Switch */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Social Media Presence</p>
                <p className="text-[11px] text-slate-400">
                  Active Instagram, X, LinkedIn, or YouTube community
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.social_media}
                  onChange={(e) => setForm({ ...form, social_media: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Creator Verification Switch */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Creator ID Verification</p>
                <p className="text-[11px] text-slate-400">
                  Government ID & business address validated by platform
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.creator_verification}
                  onChange={(e) =>
                    setForm({ ...form, creator_verification: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: Campaign Features */}
        <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">3. Campaign Features & Strategy</h2>
              <p className="text-xs text-slate-400">Media, incentives, and backer engagement triggers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Video Included Switch */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-white">Pitch Video Included</p>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    HIGH IMPACT
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  High-quality 90-120 second video pitch
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.video}
                  onChange={(e) => setForm({ ...form, video: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Pre-launch Community Size */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Pre-launch Community Size
              </label>
              <select
                value={form.community_size}
                onChange={(e) =>
                  setForm({ ...form, community_size: e.target.value as CommunitySize })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
              >
                {COMMUNITY_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} email subscribers / waitlist members
                  </option>
                ))}
              </select>
            </div>

            {/* Updates Planned */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Number of Updates Planned
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={form.updates}
                onChange={(e) =>
                  setForm({ ...form, updates: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <p className="text-[11px] text-slate-400">
                Recommended: 1 update per week during campaign.
              </p>
            </div>

            {/* Early Bird Reward Switch */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Early Bird Reward Tier</p>
                <p className="text-[11px] text-slate-400">
                  Discounted 24-48h tier for day-one velocity
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.early_bird}
                  onChange={(e) => setForm({ ...form, early_bird: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Structured Marketing Plan */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Marketing & PR Plan</p>
                <p className="text-[11px] text-slate-400">
                  Press release list, media embargo, ad budget
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.marketing_plan}
                  onChange={(e) =>
                    setForm({ ...form, marketing_plan: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Reward Available */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Physical / Digital Rewards</p>
                <p className="text-[11px] text-slate-400">
                  Structured pledge tiers with tangible backer perks
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.reward_available}
                  onChange={(e) =>
                    setForm({ ...form, reward_available: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Prediction Execution Action Section */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0c1324] to-indigo-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-white">Ready for Machine Learning Inference</h3>
            <p className="text-xs text-slate-400">
              Evaluates against empirical Kickstarter & Indiegogo feature importance weights.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Predict Campaign Success</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Submitting Feedback Animation */}
        {isSubmitting && (
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-mono flex items-center gap-3 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>{loadingStep || 'Processing ML Pipeline...'}</span>
          </div>
        )}
      </form>
    </div>
  );
};
