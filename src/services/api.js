import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== '' 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? 'http://localhost:8000' : '');

const API_BASE_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, '') : '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
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
  getFeatures: async () => {
    const res = await apiClient.get('/features');
    return res.data;
  },

  getShapFeatureSelection: async () => {
    const res = await apiClient.get('/feature-selection/shap');
    return res.data;
  },

  getFeatureSelection: async () => {
    const res = await apiClient.get('/feature-selection');
    return res.data;
  },

  getModelsComparison: async () => {
    const res = await apiClient.get('/models/comparison');
    return res.data;
  },

  getConfusionMatrix: async (model) => {
    const url = model ? `/models/confusion-matrix?model=${encodeURIComponent(model)}` : '/models/confusion-matrix';
    const res = await apiClient.get(url);
    return res.data;
  },

  getRocCurve: async (model) => {
    const url = model ? `/models/roc-curve?model=${encodeURIComponent(model)}` : '/models/roc-curve';
    const res = await apiClient.get(url);
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
  },

  // Blood Pressure Module
  getBloodPressure: async (limit = 100) => {
    const res = await apiClient.get(`/blood-pressure?limit=${limit}`);
    return res.data;
  },

  saveBloodPressure: async (data) => {
    const res = await apiClient.post('/blood-pressure', data);
    return res.data;
  },

  deleteBloodPressure: async (id) => {
    const res = await apiClient.delete(`/blood-pressure/${id}`);
    return res.data;
  },

  // Kidney Health / Lab Results Module
  getLabResults: async (limit = 100) => {
    const res = await apiClient.get(`/lab-results?limit=${limit}`);
    return res.data;
  },

  saveLabResult: async (data) => {
    const res = await apiClient.post('/lab-results', data);
    return res.data;
  },

  deleteLabResult: async (id) => {
    const res = await apiClient.delete(`/lab-results/${id}`);
    return res.data;
  },

  // Health Monitoring / Wearable Logs Module
  getWearableLogs: async (limit = 100) => {
    const res = await apiClient.get(`/wearable-logs?limit=${limit}`);
    return res.data;
  },

  saveWearableLog: async (data) => {
    const res = await apiClient.post('/wearable-logs', data);
    return res.data;
  },

  deleteWearableLog: async (id) => {
    const res = await apiClient.delete(`/wearable-logs/${id}`);
    return res.data;
  },

  // Central Health Summary
  getHealthSummary: async () => {
    const res = await apiClient.get('/health-summary');
    return res.data;
  }
};

export default api;
