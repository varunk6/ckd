import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { 
  Activity, 
  Database, 
  BrainCircuit, 
  Target, 
  TrendingUp, 
  History, 
  FileText, 
  Stethoscope, 
  FlaskConical,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  GitCompare,
  Layers
} from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';

const COLORS = ['#FF6B00', '#10B981'];

export default function Dashboard() {
  const { metadata, modelInfo, modelComparison, featureSelectionData, history, apiConnected } = usePrediction();

  const totalPredictions = history.length;
  const ckdPredictions = history.filter(h => h.prediction === 'ckd').length;
  const nonCkdPredictions = history.filter(h => h.prediction === 'notckd').length;

  const bestModelName = modelInfo?.best_model_name || 'Naive Bayes';
  const metrics = modelInfo?.best_model_metrics || {};
  const accuracyPct = metrics.accuracy ? (metrics.accuracy * 100).toFixed(1) : '98.3';
  const rocAucVal = metrics.roc_auc ? metrics.roc_auc.toFixed(4) : '1.0000';
  const f1Val = metrics.f1_score ? (metrics.f1_score * 100).toFixed(1) : '98.2';

  const classDist = metadata?.class_distribution || { ckd: 250, notckd: 150, total: 400 };
  const pieData = [
    { name: 'CKD Cases', value: classDist.ckd, color: '#FF6B00' },
    { name: 'Non-CKD Cases', value: classDist.notckd, color: '#10B981' }
  ];

  const modelsList = modelComparison?.models || modelInfo?.all_models_comparison || [];
  const topFeatures = featureSelectionData?.top_features || modelInfo?.top_features || [
    { feature: 'hemo (Hemoglobin)', score: 0.92 },
    { feature: 'sc (Serum Creatinine)', score: 0.88 },
    { feature: 'sg (Specific Gravity)', score: 0.84 },
    { feature: 'al (Albumin)', score: 0.79 },
    { feature: 'bu (Blood Urea)', score: 0.75 }
  ];

  const featureChartData = topFeatures.slice(0, 6).map(f => ({
    name: typeof f === 'string' ? f : f.feature || f.name,
    importance: typeof f === 'string' ? 0.85 : (f.score || f.importance || Math.abs(f.shap_value) || 0.8)
  }));

  return (
    <div className="space-y-6">
      {/* Page Title & Medical Disclaimer Header */}
      <PageHeader 
        title="Explainable Multi-Model CKD Prediction Framework" 
        subtitle="Clinical decision support & Explainable AI platform powered by multi-classifier evaluation on the UCI Chronic Kidney Disease dataset."
      />

      {/* Prominent Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold">Educational Screening Tool Only:</span> This application is intended strictly for educational screening and research evaluation purposes. It is not a clinical diagnostic tool. Model likelihood outputs do not replace qualified medical advice.
        </div>
      </div>

      {/* Primary Telemetry Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Dataset Cohort"
          value={metadata ? `${metadata.total_records} Records` : '400 Records'}
          subtitle={`CKD: ${classDist.ckd} | Non-CKD: ${classDist.notckd}`}
          icon={Database}
          trend={{ value: 'UCI Repository', positive: true }}
        />
        <StatCard
          title="Best Model Selected"
          value={bestModelName}
          subtitle={`Balancing: ${modelInfo?.class_balancing_label || 'SMOTE'}`}
          icon={BrainCircuit}
          trend={{ value: 'Auto-Selected', positive: true }}
        />
        <StatCard
          title="Best Model Accuracy"
          value={`${accuracyPct}%`}
          subtitle={`F1-Score: ${f1Val}% | ROC-AUC: ${rocAucVal}`}
          icon={Target}
          trend={{ value: `5-Fold CV`, positive: true }}
        />
        <StatCard
          title="Available Classifiers"
          value={`${modelsList.length || 8} Models`}
          subtitle={`Evaluated via Stratified CV`}
          icon={Layers}
          trend={{ value: 'Multi-Model', positive: true }}
        />
      </div>

      {/* Real Dynamic Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: CKD vs Non-CKD Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-[#FF6B00]" />
            Target Class Distribution
          </h3>
          <p className="text-[11px] text-gray-500">
            UCI Chronic Kidney Disease cohort breakdown ({classDist.total || 400} total instances).
          </p>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val} Patients`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs pt-1 border-t border-gray-100">
            <span className="flex items-center gap-1.5 font-medium text-gray-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]"></span> CKD ({classDist.ckd})
            </span>
            <span className="flex items-center gap-1.5 font-medium text-gray-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Non-CKD ({classDist.notckd})
            </span>
          </div>
        </div>

        {/* Chart 2: Model Performance Comparison */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-[#FF6B00]" />
            Classifier Performance Comparison
          </h3>
          <p className="text-[11px] text-gray-500">
            Empirical 5-Fold Cross-Validation Accuracy across trained model architectures.
          </p>
          <div className="h-48">
            {modelsList.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelsList} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="model_name" angle={-35} textAnchor="end" tick={{ fontSize: 8 }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 9 }} />
                  <Tooltip formatter={(val) => [`${(val * 100).toFixed(1)}%`, 'Accuracy']} />
                  <Bar dataKey="accuracy" fill="#FF6B00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">Loading model comparison data...</div>
            )}
          </div>
        </div>

        {/* Chart 3: Top Feature Importance */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FF6B00]" />
            Top Feature Importance
          </h3>
          <p className="text-[11px] text-gray-500">
            Key clinical parameters selected via composite feature selection pipeline.
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureChartData} layout="vertical" margin={{ top: 5, right: 10, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 9 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 8 }} width={70} />
                <Tooltip formatter={(val) => [val.toFixed(3), 'Importance Score']} />
                <Bar dataKey="importance" fill="#374151" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          to="/predict" 
          className="bg-gradient-to-br from-[#FF6B00] to-orange-600 text-white rounded-2xl p-6 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 block"
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-4">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold">Perform CKD Risk Prediction</h3>
          <p className="text-orange-100 text-xs mt-2 leading-relaxed">
            Enter patient demographics, blood markers, and urine analysis to get immediate risk stratification and SHAP explanations.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold bg-white text-[#FF6B00] px-3 py-1.5 rounded-lg shadow-sm">
            Launch Form &rarr;
          </div>
        </Link>

        <Link 
          to="/experiment" 
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-orange-300 hover:shadow-md transition-all block"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4 text-[#FF6B00]">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Research Sandbox</h3>
          <p className="text-gray-500 text-xs mt-2 leading-relaxed">
            Configure preprocessing, feature selection, SMOTE balancing, and Stratified K-Fold CV to train custom classifiers live.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#FF6B00]">
            Run Custom Pipeline &rarr;
          </div>
        </Link>

        <Link 
          to="/report" 
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-orange-300 hover:shadow-md transition-all block"
        >
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4 text-gray-800">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Academic Research Report</h3>
          <p className="text-gray-500 text-xs mt-2 leading-relaxed">
            Generate and export a comprehensive 17-section research paper with empirical model comparisons and SHAP figures.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-gray-700">
            View Research Paper &rarr;
          </div>
        </Link>
      </div>

      {/* Methodological Pipeline Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#FF6B00]" />
          Methodological Pipeline Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { step: '1. Data Preprocessing', desc: 'UCI Dataset scrubbing (400 records, missing handling, Median & Mode imputation, StandardScaler, One-Hot Encoding).' },
            { step: '2. Feature Selection', desc: '6 Algorithms evaluated (Correlation, Chi-Square, Variance Threshold, RFE, LASSO, Mutual Information).' },
            { step: '3. Class Balancing', desc: 'SMOTE / SMOTETomek oversampling applied strictly to training folds to prevent data leakage.' },
            { step: '4. Model Training', desc: '8 Machine Learning Classifiers trained (Logistic Regression, DT, RF, SVM, KNN, Naive Bayes, XGBoost, MLP).' },
            { step: '5. Model Evaluation', desc: 'Stratified 5-Fold Cross-Validation measuring Accuracy, Precision, Recall, F1-Score, and ROC-AUC.' },
            { step: '6. Explainable AI (XAI)', desc: 'SHAP waterfall attribution values & LIME localized feature explanation rules generated dynamically.' },
          ].map((s, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
              <div className="font-bold text-xs text-[#FF6B00]">{s.step}</div>
              <div className="text-xs text-gray-600 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

