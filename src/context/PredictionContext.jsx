import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
  const [apiConnected, setApiConnected] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const [metadata, setMetadata] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [modelComparison, setModelComparison] = useState(null);
  const [featureSelectionData, setFeatureSelectionData] = useState(null);
  const [shapData, setShapData] = useState(null);
  const [featuresCatalog, setFeaturesCatalog] = useState(null);
  
  const [lastPrediction, setLastPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [experimentRunning, setExperimentRunning] = useState(false);

  // Health Modules State
  const [bpReadings, setBpReadings] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [wearableLogs, setWearableLogs] = useState([]);
  const [healthSummary, setHealthSummary] = useState(null);

  const checkHealthAndLoadData = useCallback(async () => {
    try {
      const health = await api.checkHealth();
      setApiConnected(true);
      setModelLoaded(health.model_loaded);

      // Load research metadata & health data
      const [meta, info, comp, fsData, shapRes, featRes, histData, bpData, labData, wearData, summaryData] = await Promise.allSettled([
        api.getDatasetInfo(),
        api.getModelInfo(),
        api.getModelsComparison(),
        api.getFeatureSelection(),
        api.getShapFeatureSelection(),
        api.getFeatures(),
        api.getPredictionsHistory(),
        api.getBloodPressure(),
        api.getLabResults(),
        api.getWearableLogs(),
        api.getHealthSummary()
      ]);

      if (meta.status === 'fulfilled') setMetadata(meta.value);
      if (info.status === 'fulfilled') setModelInfo(info.value);
      if (comp.status === 'fulfilled') setModelComparison(comp.value);
      if (fsData.status === 'fulfilled') setFeatureSelectionData(fsData.value);
      if (shapRes.status === 'fulfilled') setShapData(shapRes.value);
      if (featRes.status === 'fulfilled') setFeaturesCatalog(featRes.value);
      if (histData.status === 'fulfilled') setHistory(histData.value);
      if (bpData.status === 'fulfilled') setBpReadings(bpData.value);
      if (labData.status === 'fulfilled') setLabResults(labData.value);
      if (wearData.status === 'fulfilled') setWearableLogs(wearData.value);
      if (summaryData.status === 'fulfilled') setHealthSummary(summaryData.value);

    } catch (err) {
      console.warn("Backend connection check failed:", err);
      setApiConnected(false);
      setModelLoaded(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealthAndLoadData();
    const interval = setInterval(checkHealthAndLoadData, 12000);
    return () => clearInterval(interval);
  }, [checkHealthAndLoadData]);

  // BP Helpers
  const addBpReading = async (bpData) => {
    const res = await api.saveBloodPressure(bpData);
    const updated = await api.getBloodPressure();
    setBpReadings(updated);
    const summary = await api.getHealthSummary();
    setHealthSummary(summary);
    return res;
  };

  const removeBpReading = async (id) => {
    await api.deleteBloodPressure(id);
    setBpReadings(prev => prev.filter(item => item.id !== id));
    const summary = await api.getHealthSummary();
    setHealthSummary(summary);
  };

  // Lab Results Helpers
  const addLabResult = async (labData) => {
    const res = await api.saveLabResult(labData);
    const updated = await api.getLabResults();
    setLabResults(updated);
    const summary = await api.getHealthSummary();
    setHealthSummary(summary);
    return res;
  };

  const removeLabResult = async (id) => {
    await api.deleteLabResult(id);
    setLabResults(prev => prev.filter(item => item.id !== id));
    const summary = await api.getHealthSummary();
    setHealthSummary(summary);
  };

  // Wearable Logs Helpers
  const addWearableLog = async (logData) => {
    const res = await api.saveWearableLog(logData);
    const updated = await api.getWearableLogs();
    setWearableLogs(updated);
    const summary = await api.getHealthSummary();
    setHealthSummary(summary);
    return res;
  };

  const removeWearableLog = async (id) => {
    await api.deleteWearableLog(id);
    setWearableLogs(prev => prev.filter(item => item.id !== id));
    const summary = await api.getHealthSummary();
    setHealthSummary(summary);
  };

  const executePrediction = async (patientInput) => {
    setLoading(true);
    try {
      const res = await api.predictCKD(patientInput);
      setLastPrediction(res);
      // Refresh history list
      const hist = await api.getPredictionsHistory();
      setHistory(hist);
      const summary = await api.getHealthSummary();
      setHealthSummary(summary);
      return res;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const runNewExperiment = async (params) => {
    setExperimentRunning(true);
    try {
      const res = await api.runExperiment(params);
      await checkHealthAndLoadData();
      return res;
    } catch (err) {
      throw err;
    } finally {
      setExperimentRunning(false);
    }
  };

  const deleteHistoryRecord = async (id) => {
    try {
      await api.deletePrediction(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete history record:", err);
    }
  };

  const clearAllHistory = async () => {
    try {
      await api.clearAllPredictions();
      setHistory([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  return (
    <PredictionContext.Provider value={{
      apiConnected,
      apiOnline: apiConnected,
      modelLoaded,
      loading,
      metadata,
      modelInfo,
      modelComparison,
      featureSelectionData,
      shapData,
      featuresCatalog,
      lastPrediction,
      setLastPrediction,
      history,
      experimentRunning,
      bpReadings,
      labResults,
      wearableLogs,
      healthSummary,
      addBpReading,
      removeBpReading,
      addLabResult,
      removeLabResult,
      addWearableLog,
      removeWearableLog,
      executePrediction,
      runNewExperiment,
      deleteHistoryRecord,
      clearAllHistory,
      refreshData: checkHealthAndLoadData
    }}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => useContext(PredictionContext);
