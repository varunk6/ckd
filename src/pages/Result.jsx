import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle2, 
  BrainCircuit, 
  Printer, 
  RefreshCw, 
  Sparkles, 
  ArrowLeft, 
  Info,
  History,
  Clock,
  Cpu
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { usePrediction } from '../context/PredictionContext';

export default function Result() {
  const { lastPrediction, modelInfo } = usePrediction();
  const navigate = useNavigate();

  if (!lastPrediction) {
    return (
      <div className="p-12 text-center space-y-4 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-lg mx-auto">
        <Info className="w-10 h-10 text-gray-400 mx-auto" />
        <h3 className="text-lg font-bold text-gray-800">No Active Screening Result</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Please submit clinical attributes on the Check Health form to evaluate your screening result.
        </p>
        <Link 
          to="/check-health" 
          className="inline-flex items-center gap-2 bg-[#FF6B00] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-orange-500/20"
        >
          Go to Check Health Form
        </Link>
      </div>
    );
  }

  const isCkd = lastPrediction.prediction === 'ckd';
  const probPct = lastPrediction.probability_percentage || (lastPrediction.probability * 100).toFixed(1);
  const predictionText = isCkd ? "Higher likelihood of CKD" : "Lower likelihood of CKD";
  const predictionDate = lastPrediction.timestamp || new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  const modelUsed = lastPrediction.model_name || modelInfo?.best_model_name || 'Trained Machine Learning Model';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link to="/check-health" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Back to Check Health
        </Link>
        <button 
          onClick={() => window.print()} 
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Print Result
        </button>
      </div>

      {/* Main Result Card */}
      <div className={`p-8 rounded-3xl border shadow-lg space-y-6 ${
        isCkd 
          ? 'bg-gradient-to-br from-rose-50 via-orange-50/50 to-white border-rose-200 text-rose-950' 
          : 'bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-emerald-200 text-emerald-950'
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
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                  Screening Evaluation
                </span>
                <h2 className="text-2xl md:text-3xl font-black mt-0.5">
                  {predictionText}
                </h2>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-gray-700 max-w-xl">
              Based on the submitted 24 clinical parameters, the machine learning model calculated a statistical likelihood score. This is an educational screening estimation, not a medical diagnosis.
            </p>

            {/* Meta tags: Date/Time & Model Used */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-600">
              <span className="flex items-center gap-1.5 font-semibold">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                Evaluated: <strong>{predictionDate}</strong>
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Cpu className="w-3.5 h-3.5 text-gray-400" />
                Model: <strong>{modelUsed}</strong>
              </span>
            </div>
          </div>

          {/* Model-Estimated Likelihood Box */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center min-w-[220px] shadow-sm space-y-2">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Model-Estimated Likelihood
            </div>
            <div className={`text-4xl font-black ${isCkd ? 'text-rose-600' : 'text-emerald-600'}`}>
              {probPct}%
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mt-2">
              <div 
                className={`h-full transition-all duration-500 ${isCkd ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(Math.max(parseFloat(probPct), 5), 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 font-semibold pt-1">
              {isCkd ? 'Higher statistical probability' : 'Lower statistical probability'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={() => navigate('/explain')}
          className="px-6 py-3.5 rounded-xl bg-[#FF6B00] hover:bg-[#E05A00] text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-2"
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Why Did AI Make This Prediction? (SHAP)</span>
        </button>

        <button
          onClick={() => navigate('/history')}
          className="px-6 py-3.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <History className="w-4 h-4" />
          <span>View Screening History</span>
        </button>
      </div>

      {/* Medical Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Medical Disclaimer:</span> This application is intended for educational and research screening purposes only. It is not a medical diagnosis or treatment tool. Consult a qualified healthcare professional for medical advice.
        </div>
      </div>
    </div>
  );
}
