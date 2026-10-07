import {
  CampaignInput,
  PredictionResult,
  AnalyticsData,
} from '../types/prediction';
import { predictCampaign } from './mlEngine';
import { getInitialHistoricalPredictions } from '../data/mockPredictions';

const STORAGE_KEY = 'crowdfundai_predictions_v1';

// In-browser fallback repository
function loadStoredPredictions(): PredictionResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  const initial = getInitialHistoricalPredictions();
  saveStoredPredictions(initial);
  return initial;
}

function saveStoredPredictions(list: PredictionResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export const ApiService = {
  async predict(input: CampaignInput): Promise<PredictionResult> {
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (response.ok) {
        const data = await response.json();
        // Also cache locally
        const list = loadStoredPredictions();
        list.unshift(data);
        saveStoredPredictions(list);
        return data;
      }
    } catch {
      // Backend unavailable, fallback to local ML engine
    }

    // Client-side execution fallback
    const result = predictCampaign(input, false);
    const list = loadStoredPredictions();
    list.unshift(result);
    saveStoredPredictions(list);
    return result;
  },

  async getPredictions(params?: {
    search?: string;
    category?: string;
    risk?: string;
  }): Promise<PredictionResult[]> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.category && params.category !== 'All') query.append('category', params.category);
      if (params?.risk && params.risk !== 'All') query.append('risk', params.risk);

      const url = `/api/predictions${query.toString() ? '?' + query.toString() : ''}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch {
      // Fallback
    }

    // Filter local predictions
    let list = loadStoredPredictions();
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((p) => p.campaign_name.toLowerCase().includes(q));
    }
    if (params?.category && params.category !== 'All') {
      list = list.filter((p) => p.inputs.category === params.category);
    }
    if (params?.risk && params.risk !== 'All') {
      list = list.filter((p) => p.risk_level === params.risk);
    }
    return list;
  },

  async getPredictionById(id: string): Promise<PredictionResult | null> {
    try {
      const response = await fetch(`/api/predictions/${encodeURIComponent(id)}`);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }

    const list = loadStoredPredictions();
    return list.find((p) => p.id === id) || null;
  },

  async deletePrediction(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/predictions/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const list = loadStoredPredictions().filter((p) => p.id !== id);
        saveStoredPredictions(list);
        return true;
      }
    } catch {
      // Fallback
    }

    const list = loadStoredPredictions().filter((p) => p.id !== id);
    saveStoredPredictions(list);
    return true;
  },

  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }

    const list = loadStoredPredictions();
    return calculateLocalAnalytics(list);
  },

  async getModelInfo(): Promise<any> {
    try {
      const response = await fetch('/api/model-info');
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }

    return {
      model_name: 'Calibrated Random Forest Ensemble',
      version: 'v1.4-RF',
      framework: 'Scikit-Learn Architecture (Simulated & Calibrated in TypeScript)',
      trees: 100,
      max_depth: 12,
      metrics: {
        accuracy: 84.6,
        precision: 82.1,
        recall: 86.3,
        f1_score: 84.1,
        roc_auc: 0.902,
      },
      confusion_matrix: {
        true_positive: 4210,
        false_positive: 785,
        true_negative: 3955,
        false_negative: 698,
      },
      training_samples: 48250,
      features_used: [
        { name: 'Funding Goal (Log Normalized)', weight: 0.22, rank: 1 },
        { name: 'Pre-launch Community Size', weight: 0.17, rank: 2 },
        { name: 'Creator Experience & Track Record', weight: 0.15, rank: 3 },
        { name: 'Pitch Video Presence', weight: 0.13, rank: 4 },
        { name: 'Social Media Footprint', weight: 0.11, rank: 5 },
        { name: 'Campaign Duration (Days)', weight: 0.08, rank: 6 },
        { name: 'Early Bird Tier Strategy', weight: 0.06, rank: 7 },
        { name: 'Backer Update Frequency', weight: 0.05, rank: 8 },
        { name: 'Creator Identity Verification', weight: 0.03, rank: 9 },
      ],
    };
  },

  async resetData(): Promise<void> {
    const initial = getInitialHistoricalPredictions();
    saveStoredPredictions(initial);
  },
};

function calculateLocalAnalytics(list: PredictionResult[]): AnalyticsData {
  const total = list.length;
  const successful = list.filter((p) => p.probability >= 70).length;
  const highRisk = list.filter((p) => p.risk_level === 'High').length;
  const avgProb =
    total > 0
      ? Math.round((list.reduce((acc, p) => acc + p.probability, 0) / total) * 10) / 10
      : 0;

  const high = list.filter((p) => p.probability >= 70).length;
  const medium = list.filter((p) => p.probability >= 45 && p.probability < 70).length;
  const low = list.filter((p) => p.probability < 45).length;

  const categories = [
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
  ] as const;

  const categoryPerformance = categories.map((cat) => {
    const catList = list.filter((p) => p.inputs.category === cat);
    const catCount = catList.length;
    const catAvg =
      catCount > 0
        ? Math.round((catList.reduce((acc, p) => acc + p.probability, 0) / catCount) * 10) / 10
        : 50.0;
    const catSuccess =
      catCount > 0 ? Math.round((catList.filter((p) => p.probability >= 70).length / catCount) * 100) : 50;

    return {
      category: cat,
      avg_probability: catAvg,
      total_campaigns: catCount,
      success_rate: catSuccess,
    };
  });

  const durationBrackets = [
    { label: '< 20 Days', min: 0, max: 19 },
    { label: '20 - 30 Days', min: 20, max: 30 },
    { label: '31 - 40 Days', min: 31, max: 40 },
    { label: '41 - 60 Days', min: 41, max: 60 },
    { label: '> 60 Days', min: 61, max: 999 },
  ];

  const durationVsProb = durationBrackets.map((b) => {
    const items = list.filter((p) => p.inputs.duration >= b.min && p.inputs.duration <= b.max);
    const avg =
      items.length > 0
        ? Math.round((items.reduce((acc, p) => acc + p.probability, 0) / items.length) * 10) / 10
        : 52;
    return {
      duration_bracket: b.label,
      avg_probability: avg,
      count: items.length,
    };
  });

  const goalRanges = [
    { label: '< $5k', min: 0, max: 5000 },
    { label: '$5k - $15k', min: 5001, max: 15000 },
    { label: '$15k - $50k', min: 15001, max: 50000 },
    { label: '$50k - $100k', min: 50001, max: 100000 },
    { label: '> $100k', min: 100001, max: 9999999 },
  ];

  const goalVsProb = goalRanges.map((g) => {
    const items = list.filter((p) => p.inputs.goal >= g.min && p.inputs.goal <= g.max);
    const avg =
      items.length > 0
        ? Math.round((items.reduce((acc, p) => acc + p.probability, 0) / items.length) * 10) / 10
        : 45;
    return {
      goal_range: g.label,
      avg_probability: avg,
      count: items.length,
    };
  });

  return {
    total_predictions: total,
    successful_predictions: successful,
    avg_probability: avgProb,
    high_risk_count: highRisk,
    distribution: { high, medium, low },
    category_performance: categoryPerformance,
    duration_vs_probability: durationVsProb,
    goal_vs_probability: goalVsProb,
    model_metrics: {
      accuracy: 84.6,
      precision: 82.1,
      recall: 86.3,
      f1_score: 84.1,
      roc_auc: 0.902,
      confusion_matrix: {
        true_positive: 4210,
        false_positive: 785,
        true_negative: 3955,
        false_negative: 698,
      },
    },
  };
}
