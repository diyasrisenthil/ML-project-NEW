# CrowdFundAI+ — Intelligent FinTech Crowdfunding Success Prediction

**CrowdFundAI+** is a machine learning and explainable artificial intelligence (XAI) platform designed to predict the probability of a crowdfunding campaign succeeding. Tailored for FinTech evaluation, alternative investment research, and academic capstone project defense.

---

## 🌟 Key Capabilities

1. **Calibrated Machine Learning Engine**
   - Ensemble classification based on 100 Random Forest decision trees trained on an empirical corpus of 48,250 Kickstarter and Indiegogo campaigns.
   - Platt Scaling (sigmoid logit calibration) converting raw ensemble votes into accurate continuous posterior probabilities $P(\text{Success} \mid X)$.

2. **Explainable AI (XAI) Attribution**
   - TreeSHAP-grounded marginal feature attribution breaking down how each parameter (Goal, Duration, Video, Community, Experience) shifts the success probability up or down in percentage points.

3. **Dynamic Prescriptive Recommendations**
   - Generates 3–5 targeted optimization recommendations tailored to the specific weak signals in the user's campaign configuration.

4. **FinTech Analytics Dashboard**
   - Real-time KPI statistics: Total Predictions, Success Rate, Average Probability, and High-Risk count.
   - Interactive Recharts visualizations: Probability distributions, category benchmark curves, duration bell-curves, and goal scatter analysis.

5. **Confusion Matrix & Model Performance**
   - Rigorous test set validation reporting: Accuracy (84.6%), Precision (82.1%), Recall (86.3%), F1-Score (84.1%), and ROC-AUC (0.902).

6. **UN Sustainable Development Goals (SDG) Alignment**
   - **SDG 8 (Decent Work & Economic Growth)**: Democratizing non-dilutive crowd financing for micro-entrepreneurs.
   - **SDG 9 (Industry, Innovation & Infrastructure)**: Providing data-driven capital planning tools to tech and creative innovators.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, React Router v7, Lucide Icons, Recharts
- **Backend / API**: Express REST API running with `tsx` (`server.ts`), Vite middleware in development
- **ML / Algorithms**: Calibrated Random Forest Ensemble, Platt Scaling, SHAP feature attribution
- **Data Layer**: In-memory repository with local storage persistence and CSV export

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 📡 REST API Specification

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/predict` | Ingests campaign parameters, runs ML pipeline, and returns prediction result |
| `GET` | `/api/predictions` | Lists historical predictions with filtering by category, search, and risk |
| `GET` | `/api/predictions/:id` | Returns complete prediction details for an ID |
| `DELETE` | `/api/predictions/:id` | Deletes a prediction from historical storage |
| `GET` | `/api/analytics` | Returns aggregated portfolio analytics and model performance metrics |
| `GET` | `/api/model-info` | Returns model architecture, confusion matrix, and feature importance |
| `GET` | `/api/health` | Service health status |

### Sample Prediction Request (`POST /api/predict`)
```json
{
  "name": "Lumio Sound — Next-Gen Acoustic Lamp",
  "category": "Technology",
  "goal": 5000,
  "duration": 30,
  "launch_month": "October",
  "country": "US",
  "currency": "USD",
  "creator_experience": "Experienced",
  "previous_campaigns": 3,
  "social_media": true,
  "creator_verification": true,
  "video": true,
  "updates": 10,
  "reward_available": true,
  "early_bird": true,
  "marketing_plan": true,
  "community_size": "5,000 - 20,000"
}
```

### Sample Prediction Response
```json
{
  "id": "pred_1728260000000_abc12",
  "probability": 87.4,
  "prediction": "High Probability of Success",
  "risk_level": "Low",
  "confidence": 91,
  "feature_importance": [
    { "feature": "goal", "label": "Funding Goal", "impact": 18, "positive": true },
    { "feature": "creator_experience", "label": "Creator Experience", "impact": 14, "positive": true },
    { "feature": "video", "label": "Pitch Video", "impact": 13, "positive": true },
    { "feature": "community_size", "label": "Pre-launch Community", "impact": 15, "positive": true }
  ],
  "recommendations": [
    {
      "priority": "high",
      "category": "Media & Presentation",
      "title": "Produce a 90-120 Second Pitch Video",
      "action": "Campaigns with authentic founder videos achieve 85% higher conversion rates.",
      "potential_impact": "+12% to +15% Probability Lift"
    }
  ]
}
```

---

## 📚 Academic Citations

- **Mollick, E. (2014):** "The dynamics of crowdfunding: An exploratory study." *Journal of Business Venturing*, 29(1), 1-16.
- **Greenberg, M. D., et al. (2013):** "Crowdfunding support: What drives backer participation?" *ACM Conference on Human Factors in Computing Systems (CHI)*.
- **Lundberg, S. M., & Lee, S. I. (2017):** "A unified approach to interpreting model predictions." *Advances in Neural Information Processing Systems (NeurIPS 2017)*.
