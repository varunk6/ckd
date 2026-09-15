import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { BrainCircuit, Info, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { usePrediction } from '../context/PredictionContext';

export default function ExplainableAI() {
  const { lastPrediction, modelInfo } = usePrediction();
  const [activeTab, setActiveTab] = useState('shap');

  // Fallback demo SHAP local attributions if no active prediction exists yet
  const shapList = lastPrediction?.shap_explanation?.local_explanations || [
    { feature: 'sc (Serum Creatinine)', shap_value: 0.42, effect: 'Increases CKD risk' },
    { feature: 'hemo (Hemoglobin)', shap_value: -0.38, effect: 'Decreases CKD risk' },
    { feature: 'sg (Specific Gravity)', shap_value: -0.25, effect: 'Decreases CKD risk' },
    { feature: 'al (Albumin)', shap_value: 0.22, effect: 'Increases CKD risk' },
    { feature: 'bu (Blood Urea)', shap_value: 0.18, effect: 'Increases CKD risk' },
    { feature: 'pcv (Packed Cell Volume)', shap_value: -0.15, effect: 'Decreases CKD risk' },
    { feature: 'htn (Hypertension)', shap_value: 0.12, effect: 'Increases CKD risk' },
    { feature: 'dm (Diabetes)', shap_value: 0.10, effect: 'Increases CKD risk' }
  ];

  const limeList = lastPrediction?.lime_explanation?.local_explanations || [
    { rule: 'sc > 1.20', weight: 0.35, effect: 'Increases CKD risk' },
    { rule: 'hemo <= 12.5', weight: 0.28, effect: 'Increases CKD risk' },
    { rule: 'sg <= 1.015', weight: 0.20, effect: 'Increases CKD risk' },
    { rule: 'al > 1.00', weight: 0.18, effect: 'Increases CKD risk' },
    { rule: 'htn = yes', weight: 0.14, effect: 'Increases CKD risk' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Explainable AI (XAI) Explorer" 
        subtitle="Unpacking black-box ML predictions with SHAP (SHapley Additive exPlanations) and LIME (Local Interpretable Model-agnostic Explanations)."
      />

      {/* Explainer Selector Tabs */}
      <div className="flex gap-3 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('shap')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'shap'
              ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          SHAP Waterfall & Feature Attribution
        </button>
        <button
          onClick={() => setActiveTab('lime')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'lime'
              ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          LIME Rule Weight Explanations
        </button>
      </div>

      {activeTab === 'shap' ? (
        <div className="space-y-6">
          {/* SHAP Local Waterfall Chart */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">SHAP Local Feature Attribution</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Positive values (orange) push prediction toward higher CKD risk. Negative values (emerald) push toward normal.
                </p>
              </div>
              <span className="text-xs bg-orange-100 text-[#FF6B00] px-2.5 py-1 rounded-full font-bold">
                {lastPrediction ? `Prediction #${lastPrediction.id}` : 'Sample Patient Profile'}
              </span>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={shapList}
                  margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="feature" type="category" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip formatter={(value) => value.toFixed(4)} />
                  <Bar dataKey="shap_value" name="SHAP Attribution Value" radius={[0, 4, 4, 0]}>
                    {shapList.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.shap_value > 0 ? '#FF6B00' : '#10B981'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dynamic SHAP Explanation Table */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Dynamic SHAP Feature Influence Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                    <th className="p-3">Clinical Attribute</th>
                    <th className="p-3">SHAP Value</th>
                    <th className="p-3">Model Direction / Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {shapList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">{item.feature}</td>
                      <td className="p-3 font-mono font-bold text-gray-800">{item.shap_value.toFixed(4)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.shap_value > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.effect || (item.shap_value > 0 ? 'Increases CKD risk' : 'Decreases CKD risk')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* LIME Explanation View */
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-base">LIME Local Feature Rule Attribution</h3>
          <p className="text-xs text-gray-500">
            LIME constructs a linear surrogate model in the local neighborhood of the patient instance.
          </p>

          <div className="divide-y divide-gray-100">
            {limeList.map((rule, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B00] font-bold flex items-center justify-center text-[10px]">
                    #{idx + 1}
                  </span>
                  <span className="font-mono text-gray-800 font-bold">{rule.rule}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-gray-600 font-semibold">Weight: {rule.weight}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    rule.weight > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {rule.effect}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
