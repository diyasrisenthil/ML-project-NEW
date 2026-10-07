/**
 * CrowdFundAI+ — Core Domain Types
 */

export type CampaignCategory =
  | 'Technology'
  | 'Design'
  | 'Games'
  | 'Film & Video'
  | 'Music'
  | 'Food'
  | 'Fashion'
  | 'Publishing'
  | 'Art'
  | 'Other';

export type CreatorExperience =
  | 'Beginner'
  | 'Intermediate'
  | 'Experienced'
  | 'Serial Entrepreneur';

export type CommunitySize =
  | 'None'
  | '<1,000'
  | '1,000 - 5,000'
  | '5,000 - 20,000'
  | '20,000+';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type PredictionVerdict =
  | 'High Probability of Success'
  | 'Moderate Probability of Success'
  | 'High Risk of Failure';

export interface CampaignInput {
  name: string;
  category: CampaignCategory;
  goal: number;
  duration: number; // in days (1 - 90)
  launch_month: string; // 'January'..'December'
  country: string; // 'US', 'GB', 'CA', 'DE', 'AU', etc.
  currency: string; // 'USD', 'EUR', 'GBP', etc.
  
  // Creator Info
  creator_experience: CreatorExperience;
  previous_campaigns: number;
  social_media: boolean;
  creator_verification: boolean;

  // Features
  video: boolean;
  updates: number;
  reward_available: boolean;
  early_bird: boolean;
  marketing_plan: boolean;
  community_size: CommunitySize;
}

export interface FeatureImpact {
  feature: string;
  label: string;
  impact: number; // e.g. +18 or -12 (percentage points)
  impact_raw: number; // decimal coefficient
  positive: boolean;
  description: string;
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  action: string;
  potential_impact: string;
}

export interface PredictionResult {
  id: string;
  campaign_name: string;
  created_at: string;
  inputs: CampaignInput;
  probability: number; // 0 to 100 percentage
  probability_decimal: number; // 0.0 to 1.0
  prediction: PredictionVerdict;
  risk_level: RiskLevel;
  confidence: number; // 0 to 100
  feature_importance: FeatureImpact[];
  recommendations: Recommendation[];
  explanation_summary: string;
  model_metadata: {
    model_name: string;
    version: string;
    algorithm: string;
    trained_dataset: string;
    training_sample_size: number;
    metrics: {
      accuracy: number;
      precision: number;
      recall: number;
      f1_score: number;
      roc_auc: number;
    };
  };
  is_demo?: boolean;
}

export interface AnalyticsData {
  total_predictions: number;
  successful_predictions: number;
  avg_probability: number;
  high_risk_count: number;
  distribution: {
    high: number;
    medium: number;
    low: number;
  };
  category_performance: Array<{
    category: CampaignCategory;
    avg_probability: number;
    total_campaigns: number;
    success_rate: number;
  }>;
  duration_vs_probability: Array<{
    duration_bracket: string;
    avg_probability: number;
    count: number;
  }>;
  goal_vs_probability: Array<{
    goal_range: string;
    avg_probability: number;
    count: number;
  }>;
  model_metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
    confusion_matrix: {
      true_positive: number;
      false_positive: number;
      true_negative: number;
      false_negative: number;
    };
  };
}
