import React from 'react';
import { 
  Info, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu, 
  Code2, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Compass, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function About() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader 
        title="About & Research Project Details" 
        subtitle="Second Review Information: Official research project title, faculty guide, student investigators, research direction, and technology architecture."
      />

      {/* Official Project & Team Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FF6B00]">Official Project Identification</span>
          <span className="text-xs font-bold px-2.5 py-1 bg-orange-100 text-[#FF6B00] rounded-lg">Review 2 Prototype</span>
        </div>

        <div>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Project Title</span>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 mt-1">
            Machine Learning-Based Early Detection of Chronic Kidney Disease (CKD)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Guide Card */}
          <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-950">
              <GraduationCap className="w-4 h-4 text-[#FF6B00]" />
              <span>Project Guide</span>
            </div>
            <div className="text-base font-black text-gray-900">
              Ms. Janani .D
            </div>
            <p className="text-xs text-orange-900 font-semibold">
              Assistant Professor / Department of Information Technology (AP/IT)
            </p>
          </div>

          {/* Team Members Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Users className="w-4 h-4 text-[#FF6B00]" />
              <span>Project Investigators (Team)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-gray-800 font-bold">
              <li className="flex items-center justify-between">
                <span>Arunkumar .K</span>
                <span className="font-mono text-gray-500 font-semibold">727624BIT105</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Ritheekvarshan .S</span>
                <span className="font-mono text-gray-500 font-semibold">727624BIT001</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Varun.K</span>
                <span className="font-mono text-gray-500 font-semibold">727624BIT021</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Research Direction Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#FF6B00]" />
          <span>Research Direction & Core Objectives</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Low-Cost Screening
            </div>
            <p className="text-gray-500 text-[11px]">Enables rapid outpatient triage and low-cost diagnostic screening before irreversible kidney damage.</p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Early Detection
            </div>
            <p className="text-gray-500 text-[11px]">Detects subclinical renal impairment from subtle variations in routine clinical blood & urine biomarkers.</p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Identify Attributes
            </div>
            <p className="text-gray-500 text-[11px]">Ranks all 24 attributes and isolates the 13 most impactful clinical biomarkers.</p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Reduce Clinical Testing
            </div>
            <p className="text-gray-500 text-[11px]">Reduces non-essential testing overhead by eliminating redundant laboratory investigations.</p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Improve CKD Prediction
            </div>
            <p className="text-gray-500 text-[11px]">Benchmarks 5 scikit-learn & XGBoost algorithms with 5-Fold Stratified Cross-Validation.</p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Explainable AI (SHAP)
            </div>
            <p className="text-gray-500 text-[11px]">Implements SHAP feature attribution to explain risk-increasing vs risk-decreasing factors.</p>
          </div>
        </div>
      </div>

      {/* Technology & Architecture Specifications */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#FF6B00]" />
          Technology Stack
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
            <span className="font-bold text-[#FF6B00]">Frontend Architecture</span>
            <p className="text-gray-600">React 19, Vite, Tailwind CSS, Lucide React, Recharts, Axios, React Router</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
            <span className="font-bold text-[#FF6B00]">Backend ML Architecture</span>
            <p className="text-gray-600">Python 3.14, FastAPI, Uvicorn, scikit-learn, XGBoost, SHAP, LIME, imbalanced-learn, SQLite</p>
          </div>
        </div>
      </div>

      {/* Prominent Medical Disclaimer */}
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl text-amber-900 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Important Medical Disclaimer
        </div>
        <p className="text-xs leading-relaxed">
          This application is intended strictly for educational and research screening purposes. It is not a clinical diagnosis or treatment tool. Model likelihood outputs do not replace qualified medical advice from licensed healthcare professionals.
        </p>
      </div>
    </div>
  );
}
