import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle2, 
  BrainCircuit, 
  Printer, 
  RefreshCw, 
  Sparkles, 
  ArrowLeft,
  Info
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { usePrediction } from '../context/PredictionContext';

export default function Result() {
  const { lastPrediction } = usePrediction();

  if (!lastPrediction) {
    return (
      <div className="p-12 text-center space-y-4 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-lg mx-auto">
        <Info className="w-10 h-10 text-gray-400 mx-auto" />
        <h3 className="text-lg font-bold text-gray-800">No Active Prediction Record</h3>
        <p className="text-xs text-gray-500">
          Please submit a patient clinical profile on the Prediction page to view risk scores and SHAP explanations.
        </p>
        <Link 
          to="/predict" 
          className="inline-flex items-center gap-2 bg-[#FF6B00] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-orange-500/20"
        >
          Go to Prediction Form
        </Link>
      </div>
    );
  }

  const isCkd = lastPrediction.prediction === 'ckd';
  const probPct = lastPrediction.probability_percentage || (lastPrediction.probability * 100).toFixed(1);
  const shapExplanations = lastPrediction.shap_explanation?.local_explanations || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link to="/predict" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Back to Form
        </Link>
        <button 
          onClick={() => window.print()} 
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF
        </button>
      </div>

      {/* Primary Risk Result Card */}
      <div className={`p-8 rounded-3xl border shadow-lg space-y-6 ${
        isCkd 
          ? 'bg-gradient-to-br from-rose-50 to-orange-50 border-rose-200 text-rose-950' 
          : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {isCkd ? (
                <span className="p-3 bg-rose-500 text-white rounded-2xl shadow-md">
                  <AlertTriangle className="w-8 h-8" />
                </span>
              ) : (
                <span className="p-3 bg-emerald-500 text-white rounded-2xl shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </span>
              )}
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isCkd ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
                }`}>
                  Risk Tier: {lastPrediction.risk_level} Risk
                </span>
                <h2 className="text-2xl font-black mt-1">
                  {lastPrediction.prediction_label}
                </h2>
              </div>
            </div>
            <p className="text-xs leading-relaxed opacity-90 max-w-xl">
              {lastPrediction.message}
            </p>
          </div>

          {/* Model Probability Badge */}
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-white text-center min-w-[220px] shadow-sm space-y-2">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Model Likelihood</div>
            <div className={`text-4xl font-black ${isCkd ? 'text-rose-600' : 'text-emerald-600'}`}>
              {probPct}%
            </div>
            {/* Visual Probability Bar Indicator */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className={`h-full transition-all duration-500 ${isCkd ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(Math.max(parseFloat(probPct), 5), 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 font-semibold pt-1 border-t border-gray-100">
              Model: <strong className="text-gray-700">{lastPrediction.model_name || 'Naive Bayes / Best Model'}</strong>
            </div>
            <div className="text-[10px] text-gray-400">
              {lastPrediction.created_at || new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic SHAP Explanation Section: "Why did the model make this prediction?" */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#FF6B00]" />
            Why did the model make this prediction? (SHAP Attributions)
          </h3>
          <Link to="/explain" className="text-xs font-semibold text-[#FF6B00] hover:underline">
            Explore Full XAI Engine &rarr;
          </Link>
        </div>

        <p className="text-xs text-gray-500">
          The top factors influencing this specific patient's prediction, calculated dynamically via SHAP values:
        </p>

        {shapExplanations.length === 0 ? (
          <div className="p-4 text-xs text-gray-400 bg-gray-50 rounded-xl">
            No SHAP attribution array returned. Check model explainability module logs.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {shapExplanations.slice(0, 6).map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900 min-w-[120px]">{item.feature}</span>
                  <span className="text-gray-500 font-mono text-[11px]">SHAP: {item.shap_value}</span>
                </div>
                <div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    item.shap_value > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.effect || (item.shap_value > 0 ? 'Increases CKD risk' : 'Decreases CKD risk')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prominent Medical Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Medical Disclaimer:</span> {lastPrediction.disclaimer}
        </div>
      </div>

      {/* Bottom Action CTAs */}
      <div className="flex justify-between items-center pt-2">
        <Link 
          to="/predict" 
          className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2.5 rounded-xl font-bold text-xs"
        >
          <RefreshCw className="w-4 h-4" /> New Prediction
        </Link>

        <Link 
          to="/explain" 
          className="inline-flex items-center gap-2 bg-[#FF6B00] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-orange-500/20"
        >
          <Sparkles className="w-4 h-4" /> Deep Dive into XAI Waterfall
        </Link>
      </div>
    </div>
  );
}
