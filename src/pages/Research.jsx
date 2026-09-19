import React, { useState } from 'react';
import { 
  FlaskConical, 
  Database, 
  Sliders, 
  GitCompare, 
  Gauge, 
  BrainCircuit, 
  FileText,
  CheckCircle2, 
  ArrowRight,
  ArrowDown,
  Cpu,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DatasetAnalysis from './DatasetAnalysis';
import FeatureSelection from './FeatureSelection';
import ModelComparison from './ModelComparison';
import ModelPerformance from './ModelPerformance';
import ResearchReport from './ResearchReport';
import ResearchExperiment from './ResearchExperiment';

export default function Research() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Research Report', icon: FileText },
    { id: 'dataset', label: 'Dataset Analysis', icon: Database },
    { id: 'features', label: 'Feature Selection', icon: Sliders },
    { id: 'comparison', label: 'Model Benchmark', icon: GitCompare },
    { id: 'performance', label: 'Performance Metrics', icon: Gauge },
    { id: 'sandbox', label: 'Experiment Sandbox', icon: FlaskConical },
  ];

  const methodologySteps = [
    { title: 'COLLECT CLINICAL DATA', desc: 'UCI Dataset with 24 clinical parameters' },
    { title: 'PREPROCESS', desc: 'Median imputation, One-Hot Encoding, StandardScaler' },
    { title: 'TRAIN ML MODELS', desc: '5 Classifiers trained with 5-Fold Stratified CV' },
    { title: 'SHAP FEATURE ANALYSIS', desc: 'Calculates mean |SHAP| global attributions' },
    { title: 'SELECT IMPORTANT FEATURES', desc: 'Extracts the 13 Selected High-Impact Attributes' },
    { title: 'MODEL COMPARISON', desc: 'Evaluates Accuracy, Precision, Recall, F1, ROC-AUC' },
    { title: 'CKD SCREENING', desc: 'Calibrated likelihood screening & Explainable AI' },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      <PageHeader 
        title="Advanced Machine Learning & Clinical Research Hub" 
        subtitle="In-depth ML pipeline analysis, dataset exploratory data evaluation, multi-classifier comparisons, and technical explainability metrics."
      />

      {/* Review 2 Research Methodology Flowchart Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/70 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#FF6B00] text-white rounded-lg">
              <FlaskConical className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-200">
              Project Research Methodology Pipeline
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-white/10 text-[#FF6B00] border border-[#FF6B00]/30 rounded-lg">
            Review 2 Architecture
          </span>
        </div>

        {/* Visual Pipeline Horizontal Flow (Desktop) & Stepper (Mobile) */}
        <div className="hidden lg:flex items-center justify-between gap-1 text-xs">
          {methodologySteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex-1 p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center space-y-1 transition-colors">
                <div className="text-[9px] font-black text-[#FF6B00] uppercase tracking-wider">
                  Phase {idx + 1}
                </div>
                <div className="text-[11px] font-extrabold text-white leading-tight">
                  {step.title}
                </div>
                <div className="text-[9px] text-gray-400 line-clamp-2 leading-snug">
                  {step.desc}
                </div>
              </div>
              {idx < methodologySteps.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-gray-500 shrink-0 mx-0.5" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile / Tablet vertical flowchart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:hidden text-xs">
          {methodologySteps.map((step, idx) => (
            <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-0.5">
              <span className="text-[10px] font-black text-[#FF6B00]">Step {idx + 1}: {step.title}</span>
              <p className="text-[10px] text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Research Core Dimensions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-700/60 text-[11px]">
          <div className="text-gray-300">
            <span className="text-[#FF6B00] font-bold">Dataset:</span> UCI CKD Repository
          </div>
          <div className="text-gray-300">
            <span className="text-[#FF6B00] font-bold">Attributes:</span> 24 Clinical Features
          </div>
          <div className="text-gray-300">
            <span className="text-[#FF6B00] font-bold">Algorithms:</span> 5 ML Classifiers
          </div>
          <div className="text-gray-300">
            <span className="text-[#FF6B00] font-bold">XAI:</span> SHAP Feature Analysis
          </div>
        </div>
      </div>

      {/* Tab Selector Buttons */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="mt-4">
        {activeTab === 'overview' && <ResearchReport />}
        {activeTab === 'dataset' && <DatasetAnalysis />}
        {activeTab === 'features' && <FeatureSelection />}
        {activeTab === 'comparison' && <ModelComparison />}
        {activeTab === 'performance' && <ModelPerformance />}
        {activeTab === 'sandbox' && <ResearchExperiment />}
      </div>
    </div>
  );
}
