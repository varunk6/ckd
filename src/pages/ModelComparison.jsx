import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { GitCompare, Trophy, Activity, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import api from '../services/api';

export default function ModelComparison() {
  const [compData, setCompData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModelForCm, setSelectedModelForCm] = useState(null);

  useEffect(() => {
    async function loadComparison() {
      try {
        const data = await api.getModelsComparison();
        setCompData(data);
        if (data?.models && data.models.length > 0) {
          setSelectedModelForCm(data.models[0].model_name);
        }
      } catch (err) {
        console.error("Error loading Model Comparison data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadComparison();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center space-y-3">
        <Activity className="w-8 h-8 text-[#FF6B00] animate-spin" />
        <p className="text-sm font-medium">Evaluating 8 Machine Learning Classifiers via 5-Fold Stratified CV...</p>
      </div>
    );
  }

  const modelsList = compData?.models || [];
  const bestModelName = compData?.best_model;

  // Selected model details for Confusion Matrix interactive view
  const currentCmModel = modelsList.find(m => m.model_name === selectedModelForCm) || modelsList[0];
  const cm = currentCmModel?.confusion_matrix || { tp: 0, tn: 0, fp: 0, fn: 0 };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Multi-Classifier Model Comparison" 
        subtitle="Cross-validation results, precision-recall trade-offs, ROC-AUC performance curves, and training speed across 8 machine learning models."
      />

      {/* Best Model Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-300" /> Best Performing Model
          </div>
          <h2 className="text-2xl font-black">{bestModelName}</h2>
          <p className="text-orange-100 text-xs mt-1">
            Automatically selected based on objective 5-Fold Stratified Cross-Validation F1-Score & ROC-AUC criteria.
          </p>
        </div>
        {currentCmModel && (
          <div className="text-right bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="text-3xl font-black">{((currentCmModel.f1_score || 1) * 100).toFixed(1)}%</div>
            <div className="text-[11px] text-orange-200 uppercase font-semibold mt-0.5">CV F1-Score</div>
          </div>
        )}
      </div>

      {/* Models Comparative Table */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-[#FF6B00]" />
          Empirical Classifier Evaluation Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                <th className="p-3">Model Architecture</th>
                <th className="p-3">Accuracy</th>
                <th className="p-3">Precision</th>
                <th className="p-3">Recall</th>
                <th className="p-3">F1-Score</th>
                <th className="p-3">ROC-AUC</th>
                <th className="p-3">Train Time (s)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {modelsList.map((m) => {
                const isBest = m.model_name === bestModelName;
                return (
                  <tr 
                    key={m.model_name} 
                    className={`transition-colors ${isBest ? 'bg-orange-50/70 font-semibold' : 'hover:bg-gray-50'}`}
                  >
                    <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                      {isBest && <Trophy className="w-3.5 h-3.5 text-[#FF6B00]" />}
                      {m.model_name}
                    </td>
                    <td className="p-3 font-medium text-gray-800">{(m.accuracy * 100).toFixed(2)}%</td>
                    <td className="p-3 text-gray-700">{(m.precision * 100).toFixed(2)}%</td>
                    <td className="p-3 text-gray-700">{(m.recall * 100).toFixed(2)}%</td>
                    <td className="p-3 font-bold text-[#FF6B00]">{(m.f1_score * 100).toFixed(2)}%</td>
                    <td className="p-3 text-gray-700">{m.roc_auc.toFixed(4)}</td>
                    <td className="p-3 text-gray-600 font-mono">{m.training_time_sec.toFixed(3)}s</td>
                    <td className="p-3">
                      {isBest ? (
                        <span className="bg-[#FF6B00] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                          BEST MODEL
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Evaluated</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accuracy & F1 Bar Chart Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-base">F1-Score Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelsList} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="model_name" angle={-45} textAnchor="end" tick={{ fontSize: 9 }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
                <Bar dataKey="f1_score" fill="#FF6B00" radius={[4, 4, 0, 0]} name="F1-Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Confusion Matrix Visualizer */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base">Interactive Confusion Matrix</h3>
            <select
              value={selectedModelForCm || ''}
              onChange={(e) => setSelectedModelForCm(e.target.value)}
              className="text-xs bg-gray-100 border border-gray-200 rounded-lg p-2 font-semibold text-gray-800"
            >
              {modelsList.map(m => (
                <option key={m.model_name} value={m.model_name}>{m.model_name}</option>
              ))}
            </select>
          </div>

          <p className="text-xs text-gray-500">
            Out-of-fold cumulative prediction matrix for <strong>{selectedModelForCm}</strong>:
          </p>

          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl text-center">
            <div className="p-4 bg-emerald-100/70 border border-emerald-200 rounded-lg">
              <div className="text-xs text-emerald-800 font-semibold">True Positives (TP)</div>
              <div className="text-2xl font-black text-emerald-900 mt-1">{cm.tp}</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Correctly Detected CKD</div>
            </div>
            <div className="p-4 bg-rose-100/70 border border-rose-200 rounded-lg">
              <div className="text-xs text-rose-800 font-semibold">False Positives (FP)</div>
              <div className="text-2xl font-black text-rose-900 mt-1">{cm.fp}</div>
              <div className="text-[10px] text-rose-700 mt-0.5">False Alarm (Type I)</div>
            </div>
            <div className="p-4 bg-rose-100/70 border border-rose-200 rounded-lg">
              <div className="text-xs text-rose-800 font-semibold">False Negatives (FN)</div>
              <div className="text-2xl font-black text-rose-900 mt-1">{cm.fn}</div>
              <div className="text-[10px] text-rose-700 mt-0.5">Missed Diagnosis (Type II)</div>
            </div>
            <div className="p-4 bg-emerald-100/70 border border-emerald-200 rounded-lg">
              <div className="text-xs text-emerald-800 font-semibold">True Negatives (TN)</div>
              <div className="text-2xl font-black text-emerald-900 mt-1">{cm.tn}</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Correctly Identified Normal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
