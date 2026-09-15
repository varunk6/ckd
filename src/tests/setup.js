import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('../services/api', () => ({
  default: {
    checkHealth: vi.fn().mockResolvedValue({ status: 'online', model_loaded: true }),
    getDatasetInfo: vi.fn().mockResolvedValue({ total_records: 400 }),
    getModelInfo: vi.fn().mockResolvedValue({
      best_model_name: 'Random Forest',
      best_model_metrics: { accuracy: 0.99, f1_score: 0.99, precision: 0.99, recall: 0.99, roc_auc: 1.0 }
    }),
    getMetrics: vi.fn().mockResolvedValue({ accuracy: 0.99 }),
    getClassDistribution: vi.fn().mockResolvedValue({ ckd: 250, notckd: 150 }),
    getCorrelationMatrix: vi.fn().mockResolvedValue({}),
    getEdaFeatures: vi.fn().mockResolvedValue([]),
    getFeatureSelection: vi.fn().mockResolvedValue([]),
    getModelsComparison: vi.fn().mockResolvedValue([]),
    runExperiment: vi.fn().mockResolvedValue({}),
    predictCKD: vi.fn().mockResolvedValue({ prediction: 'ckd', probability: 98.5 }),
    explainPrediction: vi.fn().mockResolvedValue({ shap: [], lime: [] }),
    getPredictionsHistory: vi.fn().mockResolvedValue([]),
    deletePrediction: vi.fn().mockResolvedValue({ success: true }),
    getResearchReport: vi.fn().mockResolvedValue({})
  },
  api: {
    checkHealth: vi.fn().mockResolvedValue({ status: 'online', model_loaded: true }),
    getDatasetInfo: vi.fn().mockResolvedValue({ total_records: 400 }),
    getModelInfo: vi.fn().mockResolvedValue({
      best_model_name: 'Random Forest',
      best_model_metrics: { accuracy: 0.99, f1_score: 0.99, precision: 0.99, recall: 0.99, roc_auc: 1.0 }
    }),
    getMetrics: vi.fn().mockResolvedValue({ accuracy: 0.99 }),
    getClassDistribution: vi.fn().mockResolvedValue({ ckd: 250, notckd: 150 }),
    getCorrelationMatrix: vi.fn().mockResolvedValue({}),
    getEdaFeatures: vi.fn().mockResolvedValue([]),
    getFeatureSelection: vi.fn().mockResolvedValue([]),
    getModelsComparison: vi.fn().mockResolvedValue([]),
    runExperiment: vi.fn().mockResolvedValue({}),
    predictCKD: vi.fn().mockResolvedValue({ prediction: 'ckd', probability: 98.5 }),
    explainPrediction: vi.fn().mockResolvedValue({ shap: [], lime: [] }),
    getPredictionsHistory: vi.fn().mockResolvedValue([]),
    deletePrediction: vi.fn().mockResolvedValue({ success: true }),
    getResearchReport: vi.fn().mockResolvedValue({})
  }
}));
