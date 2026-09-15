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
  
  const [lastPrediction, setLastPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [experimentRunning, setExperimentRunning] = useState(false);

  const checkHealthAndLoadData = useCallback(async () => {
    try {
      const health = await api.checkHealth();
      setApiConnected(true);
      setModelLoaded(health.model_loaded);

      // Load research metadata
      const [meta, info, comp, fsData, histData] = await Promise.allSettled([
        api.getDatasetInfo(),
        api.getModelInfo(),
        api.getModelsComparison(),
        api.getFeatureSelection(),
        api.getPredictionsHistory()
      ]);

      if (meta.status === 'fulfilled') setMetadata(meta.value);
      if (info.status === 'fulfilled') setModelInfo(info.value);
      if (comp.status === 'fulfilled') setModelComparison(comp.value);
      if (fsData.status === 'fulfilled') setFeatureSelectionData(fsData.value);
      if (histData.status === 'fulfilled') setHistory(histData.value);

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

  const executePrediction = async (patientInput) => {
    setLoading(true);
    try {
      const res = await api.predictCKD(patientInput);
      setLastPrediction(res);
      // Refresh history list
      const hist = await api.getPredictionsHistory();
      setHistory(hist);
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
      lastPrediction,
      setLastPrediction,
      history,
      experimentRunning,
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
