import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout for ML training experiments
});

export const api = {
  // System Telemetry
  checkHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  getDatasetInfo: async () => {
    const res = await apiClient.get('/dataset-info');
    return res.data;
  },

  getModelInfo: async () => {
    const res = await apiClient.get('/model-info');
    return res.data;
  },

  getMetrics: async () => {
    const res = await apiClient.get('/metrics');
    return res.data;
  },

  // EDA Endpoints
  getClassDistribution: async () => {
    const res = await apiClient.get('/eda/class-distribution');
    return res.data;
  },

  getCorrelationMatrix: async () => {
    const res = await apiClient.get('/eda/correlation');
    return res.data;
  },

  getEdaFeatures: async () => {
    const res = await apiClient.get('/eda/features');
    return res.data;
  },

  // Feature Selection & Model Comparison
  getFeatureSelection: async () => {
    const res = await apiClient.get('/feature-selection');
    return res.data;
  },

  getModelsComparison: async () => {
    const res = await apiClient.get('/models/comparison');
    return res.data;
  },

  // Interactive Research Experiment
  runExperiment: async (params) => {
    const res = await apiClient.post('/experiment/run', params);
    return res.data;
  },

  // Patient Prediction & Explainable AI
  predictCKD: async (patientData) => {
    const res = await apiClient.post('/predict', patientData);
    return res.data;
  },

  explainPrediction: async (inputData, method = 'both') => {
    const res = await apiClient.post('/explain', { input_data: inputData, method });
    return res.data;
  },

  // Prediction History & Deletion
  getPredictionsHistory: async (limit = 100) => {
    const res = await apiClient.get(`/predictions?limit=${limit}`);
    return res.data;
  },

  deletePrediction: async (id) => {
    const res = await apiClient.delete(`/predictions/${id}`);
    return res.data;
  },

  clearAllPredictions: async () => {
    const res = await apiClient.delete('/predictions');
    return res.data;
  },

  // Research Report Generation
  getResearchReport: async () => {
    const res = await apiClient.get('/report/generate');
    return res.data;
  }
};

export default api;
