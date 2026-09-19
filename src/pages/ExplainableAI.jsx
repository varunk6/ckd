import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, 
  ArrowUpRight, 
  ArrowDownRight, 
  Info, 
  FlaskConical, 
  ArrowLeft,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { usePrediction } from '../context/PredictionContext';

export default function ExplainableAI() {
  const { lastPrediction } = usePrediction();
  const navigate = useNavigate();

  // Extract only genuine calculated SHAP attributions from actual prediction
  const shapExplanations = lastPrediction?.shap_explanation?.local_explanations || [];

  // Separate factors into Risk-Increasing (↑) vs Risk-Decreasing (↓) based on genuine SHAP sign
  const increasingFactors = shapExplanations.filter(item => item.shap_value > 0);
  const decreasingFactors = shapExplanations.filter(item => item.shap_value < 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Why did the AI make this prediction?" 
          subtitle="Explainable AI (XAI) using SHAP (SHapley Additive exPlanations) to identify which clinical inputs influenced the model."
        />
        <button
          onClick={() => navigate('/ml-analysis')}
          className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-center"
        >
          <Sliders className="w-4 h-4 text-[#FF6B00]" />
          <span>View 24→13 Feature Analysis</span>
        </button>
      </div>

      {/* Explanation Guide Banner */}
      <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-xs text-orange-950 space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <BrainCircuit className="w-4 h-4 text-[#FF6B00]" />
          <span>Understanding Model Feature Attributions</span>
        </div>
        <p className="leading-relaxed text-orange-900 text-[11px]">
          These factors show which inputs had the strongest influence on the model's prediction. They quantify mathematical attributions calculated by the model and should not be interpreted as direct medical causation.
        </p>
      </div>

      {/* If No Active Prediction Has Been Evaluated Yet */}
      {shapExplanations.length === 0 ? (
        <div className="p-10 bg-white rounded-2xl border border-gray-200 shadow-sm text-center space-y-3">
          <Info className="w-8 h-8 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">Not Evaluated Yet</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            No prediction has been evaluated yet in this session. Please submit clinical data in the Check Health form to generate actual real-time SHAP explanations.
          </p>
          <Link
            to="/check-health"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B00] text-white font-bold text-xs shadow-md shadow-orange-500/20"
          >
            Go to Check Health Form
          </Link>
        </div>
      ) : (
        /* Actual SHAP Breakdown */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Risk-Increasing Factors (↑) */}
          <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-rose-100 pb-3">
              <span className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                <ArrowUpRight className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-rose-950">Risk-Increasing Factors (↑)</h3>
                <p className="text-[11px] text-rose-600">Pushed the model toward higher CKD likelihood</p>
              </div>
            </div>

            {increasingFactors.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No risk-increasing factors identified for this input.</p>
            ) : (
              <div className="space-y-2.5">
                {increasingFactors.map((item, idx) => (
                  <div key={idx} className="p-3 bg-rose-50/60 rounded-xl flex items-center justify-between text-xs border border-rose-100">
                    <div>
                      <span className="font-bold text-gray-900 block">{item.feature}</span>
                      {item.feature_value !== undefined && (
                        <span className="text-[10px] text-gray-500">Value: {item.feature_value}</span>
                      )}
                    </div>
                    <span className="font-bold text-rose-700 inline-flex items-center gap-1 shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +{item.shap_value.toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Risk-Decreasing Factors (↓) */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-emerald-100 pb-3">
              <span className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                <ArrowDownRight className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-emerald-950">Risk-Decreasing Factors (↓)</h3>
                <p className="text-[11px] text-emerald-600">Pushed the model toward lower CKD likelihood</p>
              </div>
            </div>

            {decreasingFactors.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No risk-decreasing factors identified for this input.</p>
            ) : (
              <div className="space-y-2.5">
                {decreasingFactors.map((item, idx) => (
                  <div key={idx} className="p-3 bg-emerald-50/60 rounded-xl flex items-center justify-between text-xs border border-emerald-100">
                    <div>
                      <span className="font-bold text-gray-900 block">{item.feature}</span>
                      {item.feature_value !== undefined && (
                        <span className="text-[10px] text-gray-500">Value: {item.feature_value}</span>
                      )}
                    </div>
                    <span className="font-bold text-emerald-700 inline-flex items-center gap-1 shrink-0">
                      <ArrowDownRight className="w-3.5 h-3.5" /> {item.shap_value.toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Rationale and Non-Causation Note */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
        <div className="font-bold flex items-center gap-1.5 text-slate-900">
          <Info className="w-4 h-4 text-slate-500" />
          <span>Clinical Context & Non-Causation Rationale</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          SHAP values estimate each clinical feature's contribution relative to the dataset baseline. A high SHAP attribution indicates statistical correlation and model decision weight, not direct biological causation. Clinical diagnosis requires comprehensive laboratory evaluation by licensed medical practitioners.
        </p>
      </div>

      {/* Prominent Medical Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Medical Disclaimer:</span> This application is intended for educational and research screening purposes only. It is not a medical diagnosis or treatment tool. Consult a qualified healthcare professional for medical advice.
        </div>
      </div>
    </div>
  );
}
