import React, { useState } from 'react';
import { FlaskConical, Play, CheckCircle2, RefreshCw, Trophy, Activity } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { usePrediction } from '../context/PredictionContext';

export default function ResearchExperiment() {
  const { runNewExperiment, experimentRunning, modelInfo } = usePrediction();

  const [cvFolds, setCvFolds] = useState(5);
  const [balancingMethod, setBalancingMethod] = useState('smote');
  const [topK, setTopK] = useState(15);
  const [selectedModel, setSelectedModel] = useState('');
  
  const [experimentResult, setExperimentResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleRunExperiment = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const res = await runNewExperiment({
        cv_folds: parseInt(cvFolds),
        balancing_method: balancingMethod,
        top_k_features: parseInt(topK),
        selected_model_name: selectedModel || null
      });
      setExperimentResult(res);
    } catch (err) {
      console.error("Experiment failed:", err);
      setErrorMsg(err.response?.data?.detail || err.message || "Experiment execution failed.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Research Experiment Sandbox" 
        subtitle="Configure preprocessing, feature selection, class balancing (SMOTE), and cross-validation parameters to train and compare classifiers live."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Form Panel */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5 lg:col-span-1">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#FF6B00]" />
            Pipeline Parameters
          </h3>

          <form onSubmit={handleRunExperiment} className="space-y-4 text-xs">
            {/* Stratified CV Folds */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Stratified Cross-Validation Folds
              </label>
              <select
                value={cvFolds}
                onChange={(e) => setCvFolds(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value={3}>3-Fold Cross-Validation</option>
                <option value={5}>5-Fold Cross-Validation (Standard)</option>
                <option value={10}>10-Fold Cross-Validation</option>
              </select>
            </div>

            {/* Class Balancing Method */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Class Balancing Method
              </label>
              <select
                value={balancingMethod}
                onChange={(e) => setBalancingMethod(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="none">Original (No Balancing)</option>
                <option value="smote">SMOTE (Synthetic Over-sampling)</option>
                <option value="smotetomek">SMOTETomek (Hybrid Oversample + Tomek)</option>
              </select>
            </div>

            {/* Feature Subset Count */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Feature Selection Subset Size (Top K)
              </label>
              <input
                type="number"
                min={5}
                max={24}
                value={topK}
                onChange={(e) => setTopK(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Optional Specific Classifier Selection */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Target Model (Optional Override)
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="">Auto-Select Best Model</option>
                <option value="Naive Bayes">Gaussian Naive Bayes</option>
                <option value="Random Forest">Random Forest Classifier</option>
                <option value="XGBoost">XGBoost Classifier</option>
                <option value="Logistic Regression">Logistic Regression</option>
                <option value="Decision Tree">Decision Tree</option>
                <option value="SVM">Support Vector Machine (SVM)</option>
                <option value="KNN">K-Nearest Neighbors (KNN)</option>
                <option value="Neural Network">Multi-Layer Perceptron (NN)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={experimentRunning}
              className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {experimentRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running Pipeline & CV...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Execute Experiment
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Experiment Results Output */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 lg:col-span-2">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FF6B00]" />
            Live Experiment Execution Telemetry
          </h3>

          {!experimentResult && !experimentRunning && (
            <div className="p-12 text-center text-gray-400 text-xs bg-gray-50 rounded-xl border border-dashed border-gray-200">
              Configure parameters on the left and click "Execute Experiment" to run live cross-validation and feature selection.
            </div>
          )}

          {experimentRunning && (
            <div className="p-12 text-center space-y-3 bg-orange-50/50 rounded-xl border border-orange-100">
              <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin mx-auto" />
              <div className="text-sm font-bold text-gray-800">Training 8 Machine Learning Classifiers...</div>
              <p className="text-xs text-gray-500">
                Fitting StandardScaler, SimpleImputer, SMOTE oversampling, and 5-Fold Stratified Cross-Validation.
              </p>
            </div>
          )}

          {experimentResult && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">
                    Experiment Complete: Best Model Selected — {experimentResult.best_model}
                  </span>
                </div>
              </div>

              {/* Best Model Summary Metrics */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Accuracy</div>
                  <div className="text-lg font-bold text-gray-900 mt-0.5">
                    {(experimentResult.metrics.accuracy * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">F1-Score</div>
                  <div className="text-lg font-bold text-[#FF6B00] mt-0.5">
                    {(experimentResult.metrics.f1_score * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Precision</div>
                  <div className="text-lg font-bold text-gray-900 mt-0.5">
                    {(experimentResult.metrics.precision * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Recall</div>
                  <div className="text-lg font-bold text-gray-900 mt-0.5">
                    {(experimentResult.metrics.recall * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* All Models Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                      <th className="p-2.5">Model</th>
                      <th className="p-2.5">Accuracy</th>
                      <th className="p-2.5">F1-Score</th>
                      <th className="p-2.5">ROC-AUC</th>
                      <th className="p-2.5">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {experimentResult.all_models.map((m) => (
                      <tr key={m.model_name} className={m.model_name === experimentResult.best_model ? 'bg-orange-50 font-bold' : ''}>
                        <td className="p-2.5">{m.model_name}</td>
                        <td className="p-2.5">{(m.accuracy * 100).toFixed(1)}%</td>
                        <td className="p-2.5 text-[#FF6B00]">{(m.f1_score * 100).toFixed(1)}%</td>
                        <td className="p-2.5">{m.roc_auc.toFixed(4)}</td>
                        <td className="p-2.5 font-mono">{m.training_time_sec.toFixed(3)}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
