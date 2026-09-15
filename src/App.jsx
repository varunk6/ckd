import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PredictionProvider } from './context/PredictionContext';
import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Result from './pages/Result';
import ExplainableAI from './pages/ExplainableAI';
import DatasetAnalysis from './pages/DatasetAnalysis';
import FeatureSelection from './pages/FeatureSelection';
import ModelComparison from './pages/ModelComparison';
import ModelPerformance from './pages/ModelPerformance';
import ResearchExperiment from './pages/ResearchExperiment';
import History from './pages/History';
import ResearchReport from './pages/ResearchReport';
import About from './pages/About';

export default function App() {
  return (
    <PredictionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="predict" element={<Prediction />} />
            <Route path="result" element={<Result />} />
            <Route path="explain" element={<ExplainableAI />} />
            <Route path="eda" element={<DatasetAnalysis />} />
            <Route path="features" element={<FeatureSelection />} />
            <Route path="comparison" element={<ModelComparison />} />
            <Route path="performance" element={<ModelPerformance />} />
            <Route path="experiment" element={<ResearchExperiment />} />
            <Route path="history" element={<History />} />
            <Route path="report" element={<ResearchReport />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PredictionProvider>
  );
}
