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
  AlertCircle
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

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Advanced Machine Learning & Clinical Research Hub" 
        subtitle="In-depth ML pipeline analysis, dataset exploratory data evaluation, multi-classifier comparisons, and technical explainability metrics."
      />

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
