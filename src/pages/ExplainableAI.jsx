import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, ArrowUpRight, ArrowDownRight, Info, FlaskConical, ArrowLeft } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { usePrediction } from '../context/PredictionContext';

export default function ExplainableAI() {
  const { lastPrediction } = usePrediction();
  const navigate = useNavigate();

  // Dynamic SHAP values from prediction response or default sample list
  const rawShapList = lastPrediction?.shap_explanation?.local_explanations || [
    { feature: 'Serum Creatinine (sc)', shap_value: 0.42 },
    { feature: 'Hemoglobin (hemo)', shap_value: -0.38 },
    { feature: 'Blood Urea (bu)', shap_value: 0.28 },
    { feature: 'Specific Gravity (sg)', shap_value: -0.25 },
    { feature: 'Albumin (al)', shap_value: 0.22 },
    { feature: 'Blood Glucose (bgr)', shap_value: 0.18 },
    { feature: 'Hypertension (htn)', shap_value: 0.14 },
    { feature: 'Packed Cell Volume (pcv)', shap_value: -0.12 }
  ];

  // Separate factors into Increasing risk vs Decreasing risk
  const increasingFactors = rawShapList.filter(item => item.shap_value > 0);
  const decreasingFactors = rawShapList.filter(item => item.shap_value < 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Why did the AI make this prediction?" 
          subtitle="Simple breakdown of health factors that influenced your AI screening outcome."
        />
        <button
          onClick={() => navigate('/research')}
          className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <FlaskConical className="w-4 h-4 text-[#FF6B00]" />
          <span>Advanced Research View</span>
        </button>
      </div>

      {/* Main Explanation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Factors that Increased Risk (↑) */}
        <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-rose-100 pb-3">
            <span className="p-2 bg-rose-100 text-rose-600 rounded-xl">
              <ArrowUpRight className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-rose-950">Factors That Increased Risk</h3>
              <p className="text-[11px] text-rose-600">Pushed model toward higher likelihood</p>
            </div>
          </div>

          {increasingFactors.length === 0 ? (
            <p className="text-xs text-gray-400 py-4">No risk-increasing factors identified.</p>
          ) : (
            <div className="space-y-3">
              {increasingFactors.map((item, idx) => (
                <div key={idx} className="p-3 bg-rose-50/60 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900">{item.feature}</span>
                  <span className="font-bold text-rose-700 inline-flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> Increased contribution
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Factors that Decreased Risk (↓) */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-emerald-100 pb-3">
            <span className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <ArrowDownRight className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-emerald-950">Factors That Decreased Risk</h3>
              <p className="text-[11px] text-emerald-600">Pushed model toward lower likelihood</p>
            </div>
          </div>

          {decreasingFactors.length === 0 ? (
            <p className="text-xs text-gray-400 py-4">No risk-decreasing factors identified.</p>
          ) : (
            <div className="space-y-3">
              {decreasingFactors.map((item, idx) => (
                <div key={idx} className="p-3 bg-emerald-50/60 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900">{item.feature}</span>
                  <span className="font-bold text-emerald-700 inline-flex items-center gap-1">
                    <ArrowDownRight className="w-3.5 h-3.5" /> Decreased contribution
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Advanced Research Notice */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-gray-900">Looking for Technical SHAP & LIME Mathematics?</h4>
          <p className="text-xs text-gray-500">
            View feature weight matrices, LIME decision boundary rules, confusion matrices, and ROC curves in the Research Hub.
          </p>
        </div>

        <Link
          to="/research"
          className="px-4 py-2.5 rounded-xl bg-[#FF6B00] text-white font-bold text-xs shadow-md shadow-orange-500/20 shrink-0"
        >
          Go to Research Hub &rarr;
        </Link>
      </div>

      {/* Medical Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Medical Disclaimer:</span> This website is intended for educational and research screening purposes only. It is not a medical diagnosis or treatment tool. Consult a qualified healthcare professional for medical advice.
        </div>
      </div>
    </div>
  );
}
