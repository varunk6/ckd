import React from 'react';
import { Info, AlertTriangle, ShieldCheck, Cpu, Code2, BookOpen } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function About() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="About & Research Specifications" 
        subtitle="System architecture, clinical dataset metadata, limitations, future work, and medical disclaimer."
      />

      {/* Prominent Medical Disclaimer */}
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Important Research Medical Disclaimer
        </div>
        <p className="text-xs leading-relaxed">
          This application is intended strictly for educational and research screening purposes. It is not a clinical diagnosis or treatment tool. Model likelihood outputs do not replace qualified medical advice from licensed healthcare professionals. Never tell a patient "You have CKD"; state "The model predicts a higher likelihood of CKD."
        </p>
      </div>

      {/* Technology & Architecture Specifications */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#FF6B00]" />
          Technology Stack
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-gray-50 rounded-xl space-y-1">
            <span className="font-bold text-[#FF6B00]">Frontend Architecture</span>
            <p className="text-gray-600">React 19, Vite, Tailwind CSS v4, Lucide React, Recharts, Axios, React Router</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl space-y-1">
            <span className="font-bold text-[#FF6B00]">Backend ML Architecture</span>
            <p className="text-gray-600">Python 3.14, FastAPI, Uvicorn, scikit-learn, XGBoost, SHAP, LIME, imbalanced-learn, SQLite</p>
          </div>
        </div>
      </div>

      {/* Research Limitations & Future Work */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
            Limitations & Threats to Validity
          </h4>
          <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
            <li>Single-center cohort dataset (400 patient instances).</li>
            <li>Absence of longitudinal progression data over time.</li>
            <li>Statistical model predictions are non-diagnostic screening scores.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#FF6B00]" />
            Future Research Directions
          </h4>
          <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
            <li>External prospective clinical validation across diverse multi-center cohorts.</li>
            <li>Deep learning transformer integration for unstructured clinical notes.</li>
            <li>FHIR / HL7 secure electronic health record (EHR) integration.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
