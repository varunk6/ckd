import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PredictionProvider } from './context/PredictionContext';
import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import BloodPressure from './pages/BloodPressure';
import KidneyHealth from './pages/KidneyHealth';
import HealthTrends from './pages/HealthTrends';
import History from './pages/History';
import ExplainableAI from './pages/ExplainableAI';
import Research from './pages/Research';
import About from './pages/About';
import Result from './pages/Result';

export default function App() {
  return (
    <PredictionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="check-health" element={<Prediction />} />
            <Route path="predict" element={<Prediction />} />
            <Route path="blood-pressure" element={<BloodPressure />} />
            <Route path="kidney-health" element={<KidneyHealth />} />
            <Route path="health-trends" element={<HealthTrends />} />
            <Route path="history" element={<History />} />
            <Route path="explain" element={<ExplainableAI />} />
            <Route path="research" element={<Research />} />
            <Route path="about" element={<About />} />
            <Route path="result" element={<Result />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PredictionProvider>
  );
}
