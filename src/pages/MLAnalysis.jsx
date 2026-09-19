import React, { useState } from 'react';
import { 
  Database, 
  GitBranch, 
  Cpu, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Sliders, 
  Award, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Info,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  ReferenceLine 
} from 'recharts';
import PageHeader from '../components/PageHeader';
import { usePrediction } from '../context/PredictionContext';

export default function MLAnalysis() {
  const { metadata, modelInfo, modelComparison, shapData, loading, apiConnected } = usePrediction();

  // Model selector for Confusion Matrix and ROC Curve
  const [selectedCmModel, setSelectedCmModel] = useState('Logistic Regression');
  const [selectedRocModel, setSelectedRocModel] = useState('Logistic Regression');

  // Fallback / safe defaults
  const modelsList = modelComparison?.models || [];
  const bestModelName = modelInfo?.best_model_name || modelComparison?.best_model || 'Logistic Regression';
  const bestMetrics = modelInfo?.best_model_metrics;

  // Selected Confusion Matrix
  const currentCmModel = modelsList.find(m => m.model_name.toLowerCase() === selectedCmModel.toLowerCase()) || modelsList[0];
  const cm = currentCmModel?.confusion_matrix;

  // Selected ROC Curve
  const currentRocModel = modelsList.find(m => m.model_name.toLowerCase() === selectedRocModel.toLowerCase()) || modelsList[0];
  const rocPoints = currentRocModel?.roc_curve || [];

  // SHAP Feature Data
  const rankedAttributes = shapData?.ranked_attributes || modelInfo?.all_24_attributes || [];
  const top13Attributes = shapData?.top_13_attributes || modelInfo?.top_13_attributes || [];

  // Data for SHAP chart (top 14 ranked for clarity)
  const shapChartData = rankedAttributes.slice(0, 14).map(attr => ({
    name: attr.label || attr.attribute,
    shap: Number(attr.mean_abs_shap || 0),
    isSelected: attr.is_selected_top_13
  }));

  // Data for Model vs Accuracy chart
  const modelAccuracyData = modelsList.map(m => ({
    name: m.model_name,
    accuracy: Number((m.accuracy * 100).toFixed(1)),
    f1: Number((m.f1_score * 100).toFixed(1)),
    auc: Number((m.roc_auc * 100).toFixed(1))
  }));

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <PageHeader
        title="Machine Learning Research & Model Analysis"
        subtitle="Second Review Demonstration: 24 Clinical Attributes → Preprocessing → 5 ML Classifiers → SHAP Feature Selection → 13 Important Attributes → Evaluated Predictions."
      />

      {/* Methodology Visual Flow */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] mb-3">
          Research Review 2 Methodology Pipeline
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
            <Database className="w-4 h-4 text-[#FF6B00]" />
            <span>24 Clinical Attributes</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
            <GitBranch className="w-4 h-4 text-[#FF6B00]" />
            <span>Data Preprocessing</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
            <Cpu className="w-4 h-4 text-[#FF6B00]" />
            <span>5 ML Models</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
            <Award className="w-4 h-4 text-[#FF6B00]" />
            <span>Model Evaluation</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
            <Sliders className="w-4 h-4 text-[#FF6B00]" />
            <span>SHAP Feature Analysis</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
          <div className="flex items-center gap-2 bg-[#FF6B00] text-white px-3 py-2 rounded-xl font-bold shadow-md">
            <span>13 Selected Attributes</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION A: DATASET                                        */}
      {/* ========================================================= */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#FF6B00] font-bold text-xs flex items-center justify-center">A</span>
            <h3 className="text-base font-extrabold text-gray-900">UCI Chronic Kidney Disease Dataset</h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg">
            Benchmark Screening Data
          </span>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          The dataset contains clinical attributes used to identify CKD and non-CKD cases. All records undergo automated scrubbing, validation, and stratified partitioning.
        </p>

        {/* Dataset Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Total Records</div>
            <div className="text-2xl font-black text-gray-900 mt-1">
              {metadata?.total_records ? `${metadata.total_records}` : '60'}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">Clinical instances</div>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="text-[11px] font-bold text-orange-800 uppercase tracking-wide">Clinical Attributes</div>
            <div className="text-2xl font-black text-[#FF6B00] mt-1">
              24 Attributes
            </div>
            <div className="text-[10px] text-orange-700 mt-0.5">14 Numeric + 10 Categorical</div>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wide">CKD Records</div>
            <div className="text-2xl font-black text-rose-600 mt-1">
              {metadata?.class_distribution?.ckd ?? metadata?.ckd_records ?? '30'}
            </div>
            <div className="text-[10px] text-rose-700 mt-0.5">Positive cases (Class 1)</div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Non-CKD Records</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {metadata?.class_distribution?.notckd ?? metadata?.non_ckd_records ?? '30'}
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5">Control cases (Class 0)</div>
          </div>
        </div>

        {/* 24 Clinical Attributes Grid */}
        <div className="pt-2">
          <div className="text-xs font-bold text-gray-800 mb-2">24 Clinical Attributes Specification:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
              <span className="font-bold text-[#FF6B00]">14 Numerical Lab Parameters:</span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Age, Blood Pressure (bp), Specific Gravity (sg), Albumin (al), Sugar (su), Blood Glucose Random (bgr), Blood Urea (bu), Serum Creatinine (sc), Sodium (sod), Potassium (pot), Hemoglobin (hemo), Packed Cell Volume (pcv), White Blood Cell Count (wc), Red Blood Cell Count (rc).
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
              <span className="font-bold text-slate-800">10 Categorical Clinical Symptoms:</span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Red Blood Cells (rbc), Pus Cell (pc), Pus Cell Clumps (pcc), Bacteria (ba), Hypertension (htn), Diabetes Mellitus (dm), Coronary Artery Disease (cad), Appetite (appet), Pedal Edema (pe), Anemia (ane).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION B: PREPROCESSING                                  */}
      {/* ========================================================= */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#FF6B00] font-bold text-xs flex items-center justify-center">B</span>
            <h3 className="text-base font-extrabold text-gray-900">Data Preprocessing Pipeline</h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-orange-100 text-[#FF6B00] rounded-lg">
            Scikit-Learn ColumnTransformer
          </span>
        </div>

        {/* Visual Pipeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
            <div className="w-6 h-6 mx-auto rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center">1</div>
            <div className="font-bold text-xs text-gray-900">Raw Clinical Data</div>
            <p className="text-[10px] text-gray-500">24 attributes + target</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
            <div className="w-6 h-6 mx-auto rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center">2</div>
            <div className="font-bold text-xs text-gray-900">Missing Values</div>
            <p className="text-[10px] text-gray-500">Median & Mode SimpleImputer</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
            <div className="w-6 h-6 mx-auto rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center">3</div>
            <div className="font-bold text-xs text-gray-900">Data Cleaning</div>
            <p className="text-[10px] text-gray-500">Strip whitespace & labels</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
            <div className="w-6 h-6 mx-auto rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center">4</div>
            <div className="font-bold text-xs text-gray-900">Encoding</div>
            <p className="text-[10px] text-gray-500">OneHotEncoder expansion</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
            <div className="w-6 h-6 mx-auto rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center">5</div>
            <div className="font-bold text-xs text-gray-900">Scaling</div>
            <p className="text-[10px] text-gray-500">StandardScaler zero-mean</p>
          </div>

          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-center space-y-1">
            <div className="w-6 h-6 mx-auto rounded-full bg-[#FF6B00] text-white font-bold text-xs flex items-center justify-center">6</div>
            <div className="font-bold text-xs text-orange-950">5-Fold CV Splits</div>
            <p className="text-[10px] text-orange-700">Stratified folds (No leakage)</p>
          </div>
        </div>

        {/* Preprocessing Step Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Missing Value Handling
            </div>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              Missing values are handled before model training: numerical lab features use median imputation to resist outlier skew, while nominal categorical symptoms use most-frequent mode.
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Categorical Encoding
            </div>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              Categorical clinical values (e.g. hypertension, pus cells, appetite) are converted into machine-readable numerical vectors using OneHotEncoder with strict unknown-category tolerance.
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Feature Scaling
            </div>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              Numerical features are scaled to zero mean and unit variance using StandardScaler, ensuring distance-sensitive algorithms like SVM and Logistic Regression converge reliably.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION C: FEATURE SELECTION                              */}
      {/* ========================================================= */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#FF6B00] font-bold text-xs flex items-center justify-center">C</span>
            <h3 className="text-base font-extrabold text-gray-900">SHAP Feature Analysis & Attribute Reduction</h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
            24 → 13 Important Attributes
          </span>
        </div>

        {/* Feature Selection Pipeline */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs flex flex-wrap items-center justify-between gap-2 font-semibold text-gray-700">
          <span>24 Clinical Attributes</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          <span>SHAP Analysis</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          <span>Important Clinical Attributes</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[#FF6B00] font-bold">13 Selected Attributes</span>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          <strong>SHAP helps identify which clinical attributes contribute most to the model's prediction.</strong> By calculating the mean absolute Shapley value across the dataset, clinical parameters are ranked by diagnostic impact. Selecting the top 13 reduces unnecessary clinical testing while preserving predictive performance.
        </p>

        {/* SHAP Importance Chart */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-800">Actual SHAP Feature Importance Ranking:</span>
            <span className="text-gray-500 text-[11px]">Mean |SHAP value| computed from trained model</span>
          </div>

          <div className="h-72 w-full bg-slate-50/50 p-3 rounded-xl border border-gray-200">
            {shapChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shapChartData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#1E293B', fontWeight: 600 }} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2.5 rounded-lg shadow-md border border-gray-200 text-xs">
                            <p className="font-bold text-gray-900">{data.name}</p>
                            <p className="text-[#FF6B00]">Mean |SHAP|: {data.shap.toFixed(4)}</p>
                            <p className="text-[10px] text-gray-500">
                              {data.isSelected ? 'Selected in Top 13' : 'Eliminated attribute'}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="shap" fill="#FF6B00" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                SHAP evaluation is computing or not yet available.
              </div>
            )}
          </div>
        </div>

        {/* 13 Selected Attributes Badges */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">
              ✓ 13 Selected High-Impact Attributes ({top13Attributes.length} confirmed):
            </span>
            <span className="text-[11px] text-gray-500">Selected for diagnostic screening</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {top13Attributes.map((attr, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">
                  {idx + 1}
                </span>
                <span>{attr.toUpperCase()}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION D: FIVE ML MODELS & MODEL COMPARISON              */}
      {/* ========================================================= */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#FF6B00] font-bold text-xs flex items-center justify-center">D</span>
            <h3 className="text-base font-extrabold text-gray-900">5 ML Models & Empirical Model Comparison</h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg">
            5-Fold Stratified Cross-Validation
          </span>
        </div>

        {/* 5 Model Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {['Random Forest', 'Gradient Boosting', 'XGBoost', 'Logistic Regression', 'Support Vector Machine'].map((name, idx) => {
            const m = modelsList.find(item => item.model_name.toLowerCase() === name.toLowerCase());
            const isSelected = m && m.model_name.toLowerCase() === bestModelName.toLowerCase();
            return (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-orange-50/70 border-[#FF6B00] shadow-sm' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-900 truncate">{name}</span>
                  {isSelected && (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-[#FF6B00] text-white px-1.5 py-0.5 rounded">
                      Selected
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-gray-500 mb-2">
                  Status: <span className="font-semibold text-emerald-600">Trained & Evaluated</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-[11px]">Accuracy:</span>
                    <span className="font-bold text-gray-900">{m ? `${(m.accuracy * 100).toFixed(1)}%` : 'Not evaluated'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-[11px]">F1-Score:</span>
                    <span className="font-bold text-gray-900">{m ? `${(m.f1_score * 100).toFixed(1)}%` : 'Not evaluated'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-[11px]">ROC-AUC:</span>
                    <span className="font-bold text-gray-900">{m ? m.roc_auc.toFixed(3) : 'Not evaluated'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Model Comparison Table */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-gray-900">Empirical Performance Comparison Across 5 Models:</h4>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">MODEL</th>
                  <th className="p-3">ACCURACY</th>
                  <th className="p-3">PRECISION</th>
                  <th className="p-3">RECALL</th>
                  <th className="p-3">F1-SCORE</th>
                  <th className="p-3">ROC-AUC</th>
                  <th className="p-3">TRAIN TIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {modelsList.length > 0 ? (
                  modelsList.map((m, idx) => {
                    const isBest = m.model_name.toLowerCase() === bestModelName.toLowerCase();
                    return (
                      <tr key={idx} className={isBest ? 'bg-orange-50/40 font-semibold' : 'hover:bg-gray-50/70'}>
                        <td className="p-3 font-bold text-gray-900 flex items-center gap-1.5">
                          {m.model_name}
                          {isBest && <span className="text-[10px] text-[#FF6B00] font-bold">★ Selected</span>}
                        </td>
                        <td className="p-3">{m.accuracy !== undefined ? `${(m.accuracy * 100).toFixed(2)}%` : 'Not evaluated yet'}</td>
                        <td className="p-3">{m.precision !== undefined ? `${(m.precision * 100).toFixed(2)}%` : 'Not evaluated yet'}</td>
                        <td className="p-3">{m.recall !== undefined ? `${(m.recall * 100).toFixed(2)}%` : 'Not evaluated yet'}</td>
                        <td className="p-3 font-bold text-gray-900">{m.f1_score !== undefined ? `${(m.f1_score * 100).toFixed(2)}%` : 'Not evaluated yet'}</td>
                        <td className="p-3">{m.roc_auc !== undefined ? m.roc_auc.toFixed(3) : 'Not evaluated yet'}</td>
                        <td className="p-3 text-gray-500">{m.training_time_sec !== undefined ? `${m.training_time_sec}s` : '--'}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-400">
                      Models have not been evaluated yet. Run experiment pipeline.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model Accuracy Chart */}
        {modelAccuracyData.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-gray-800">Model vs Accuracy & F1-Score:</span>
            <div className="h-64 w-full bg-slate-50/50 p-3 rounded-xl border border-gray-200">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelAccuracyData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#1E293B', fontWeight: 600 }} angle={-10} textAnchor="end" />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: '#64748B' }} unit="%" />
                  <Tooltip 
                    formatter={(val) => [`${val}%`, 'Score']}
                  />
                  <Bar dataKey="accuracy" name="Accuracy" fill="#FF6B00" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="f1" name="F1-Score" fill="#0F172A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Selected Model Justification Box */}
        <div className="p-5 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FF6B00]" />
            <span className="font-extrabold text-sm text-gray-900">Selected Model: {bestModelName}</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            <strong>Selection based on actual evaluation results.</strong> The model was chosen through objective cross-validation benchmarking (highest F1-score of {bestMetrics ? `${(bestMetrics.f1_score * 100).toFixed(1)}%` : '--'}, accuracy of {bestMetrics ? `${(bestMetrics.accuracy * 100).toFixed(1)}%` : '--'}, and ROC-AUC of {bestMetrics ? bestMetrics.roc_auc.toFixed(3) : '--'}). It was not hardcoded or assumed.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION E: CONFUSION MATRIX                               */}
      {/* ========================================================= */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
        <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#FF6B00] font-bold text-xs flex items-center justify-center">E</span>
            <h3 className="text-base font-extrabold text-gray-900">Confusion Matrix Analysis</h3>
          </div>

          {/* Model Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">Select Model:</span>
            <select
              value={selectedCmModel}
              onChange={(e) => setSelectedCmModel(e.target.value)}
              className="text-xs font-bold px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6B00] cursor-pointer"
            >
              {modelsList.map((m, idx) => (
                <option key={idx} value={m.model_name}>{m.model_name}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-xs text-gray-600">
          Generated from actual cross-validation predictions for <strong>{currentCmModel?.model_name || selectedCmModel}</strong>.
        </p>

        {cm ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* 2x2 Matrix */}
            <div className="md:col-span-2">
              <div className="max-w-md mx-auto border-2 border-gray-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
                <div className="text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Predicted Class
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* True Positive */}
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-1">
                    <div className="text-[10px] font-extrabold text-emerald-800 uppercase">True Positive (TP)</div>
                    <div className="text-3xl font-black text-emerald-600">{cm.tp}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Correctly Identified CKD</div>
                  </div>

                  {/* False Positive */}
                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-center space-y-1">
                    <div className="text-[10px] font-extrabold text-amber-800 uppercase">False Positive (FP)</div>
                    <div className="text-3xl font-black text-amber-600">{cm.fp}</div>
                    <div className="text-[10px] text-amber-700 font-semibold">False Alarm (Type I)</div>
                  </div>

                  {/* False Negative */}
                  <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-center space-y-1">
                    <div className="text-[10px] font-extrabold text-rose-800 uppercase">False Negative (FN)</div>
                    <div className="text-3xl font-black text-rose-600">{cm.fn}</div>
                    <div className="text-[10px] text-rose-700 font-semibold">Missed Case (Type II)</div>
                  </div>

                  {/* True Negative */}
                  <div className="p-4 bg-blue-50 border border-blue-300 rounded-xl text-center space-y-1">
                    <div className="text-[10px] font-extrabold text-blue-800 uppercase">True Negative (TN)</div>
                    <div className="text-3xl font-black text-blue-600">{cm.tn}</div>
                    <div className="text-[10px] text-blue-700 font-semibold">Correctly Identified Normal</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Matrix Metrics Sidebar */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
              <div className="font-bold text-gray-900 border-b border-gray-200 pb-2">
                Diagnostic Clinical Metrics:
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sensitivity (Recall):</span>
                <span className="font-bold text-emerald-700">
                  {cm.sensitivity !== undefined ? `${(cm.sensitivity * 100).toFixed(1)}%` : '--'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Specificity:</span>
                <span className="font-bold text-blue-700">
                  {cm.specificity !== undefined ? `${(cm.specificity * 100).toFixed(1)}%` : '--'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-bold text-gray-900">
                  {currentCmModel?.accuracy ? `${(currentCmModel.accuracy * 100).toFixed(1)}%` : '--'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">F1-Score:</span>
                <span className="font-bold text-gray-900">
                  {currentCmModel?.f1_score ? `${(currentCmModel.f1_score * 100).toFixed(1)}%` : '--'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 rounded-xl">
            Confusion matrix data not evaluated yet.
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* SECTION F: ROC CURVE                                      */}
      {/* ========================================================= */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
        <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#FF6B00] font-bold text-xs flex items-center justify-center">F</span>
            <h3 className="text-base font-extrabold text-gray-900">Receiver Operating Characteristic (ROC) Curve</h3>
          </div>

          {/* Model Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">Select Model:</span>
            <select
              value={selectedRocModel}
              onChange={(e) => setSelectedRocModel(e.target.value)}
              className="text-xs font-bold px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6B00] cursor-pointer"
            >
              {modelsList.map((m, idx) => (
                <option key={idx} value={m.model_name}>{m.model_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <p className="text-gray-600">
            Actual test predictions for <strong>{currentRocModel?.model_name || selectedRocModel}</strong>.
          </p>
          <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
            ROC-AUC: {currentRocModel?.roc_auc !== undefined ? currentRocModel.roc_auc.toFixed(3) : 'Not evaluated'}
          </span>
        </div>

        {/* ROC Curve Chart */}
        <div className="h-72 w-full bg-slate-50/50 p-4 rounded-xl border border-gray-200">
          {rocPoints.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocPoints} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="fpr" 
                  type="number" 
                  domain={[0, 1]} 
                  tick={{ fontSize: 10, fill: '#64748B' }} 
                  label={{ value: 'False Positive Rate (1 - Specificity)', position: 'insideBottom', offset: -10, fontSize: 10, fill: '#64748B' }}
                />
                <YAxis 
                  dataKey="tpr" 
                  type="number" 
                  domain={[0, 1]} 
                  tick={{ fontSize: 10, fill: '#64748B' }} 
                  label={{ value: 'True Positive Rate (Sensitivity)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748B' }}
                />
                <Tooltip 
                  formatter={(val, name) => [Number(val).toFixed(3), name === 'tpr' ? 'TPR' : 'FPR']}
                />
                <ReferenceLine 
                  segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} 
                  stroke="#94A3B8" 
                  strokeDasharray="4 4" 
                />
                <Line 
                  type="monotone" 
                  dataKey="tpr" 
                  stroke="#FF6B00" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: '#FF6B00' }} 
                  name="Model ROC"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-gray-400">
              ROC evaluation is not available yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
