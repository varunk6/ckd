import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Info,
  Activity,
  HeartPulse,
  Droplets,
  ClipboardList
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { usePrediction } from '../context/PredictionContext';

export default function Prediction() {
  const navigate = useNavigate();
  const { executePrediction, loading } = usePrediction();
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Form state initialized with standard clinical median baseline values
  const [formData, setFormData] = useState({
    // Section 1: Basic Information
    age: 48,
    bp: 80,
    sg: 1.020,
    // Section 2: Blood & Urine Information
    al: 0,
    su: 0,
    rbc: 'normal',
    pc: 'normal',
    pcc: 'notpresent',
    ba: 'notpresent',
    bgr: 120,
    bu: 36,
    sc: 1.2,
    sod: 138,
    pot: 4.5,
    hemo: 15.4,
    pcv: 44,
    wc: 7800,
    rc: 5.2,
    // Section 3: Health Conditions
    htn: 'no',
    dm: 'no',
    cad: 'no',
    appet: 'good',
    pe: 'no',
    ane: 'no'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Demo Profile: High Risk (Patient A)
  const loadHighRiskDemo = () => {
    setFormData({
      age: 62,
      bp: 90,
      sg: 1.010,
      al: 3,
      su: 2,
      rbc: 'abnormal',
      pc: 'abnormal',
      pcc: 'present',
      ba: 'present',
      bgr: 220,
      bu: 86,
      sc: 4.2,
      sod: 130,
      pot: 5.8,
      hemo: 8.5,
      pcv: 26,
      wc: 11200,
      rc: 3.2,
      htn: 'yes',
      dm: 'yes',
      cad: 'yes',
      appet: 'poor',
      pe: 'yes',
      ane: 'yes'
    });
  };

  // Demo Profile: Healthy / Low Risk (Patient B)
  const loadLowRiskDemo = () => {
    setFormData({
      age: 32,
      bp: 75,
      sg: 1.025,
      al: 0,
      su: 0,
      rbc: 'normal',
      pc: 'normal',
      pcc: 'notpresent',
      ba: 'notpresent',
      bgr: 95,
      bu: 22,
      sc: 0.8,
      sod: 142,
      pot: 4.2,
      hemo: 15.5,
      pcv: 48,
      wc: 6800,
      rc: 5.5,
      htn: 'no',
      dm: 'no',
      cad: 'no',
      appet: 'good',
      pe: 'no',
      ane: 'no'
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    try {
      const payload = {
        age: Number(formData.age),
        bp: Number(formData.bp),
        sg: Number(formData.sg),
        al: Number(formData.al),
        su: Number(formData.su),
        rbc: String(formData.rbc),
        pc: String(formData.pc),
        pcc: String(formData.pcc),
        ba: String(formData.ba),
        bgr: Number(formData.bgr),
        bu: Number(formData.bu),
        sc: Number(formData.sc),
        sod: Number(formData.sod),
        pot: Number(formData.pot),
        hemo: Number(formData.hemo),
        pcv: Number(formData.pcv),
        wc: Number(formData.wc),
        rc: Number(formData.rc),
        htn: String(formData.htn),
        dm: String(formData.dm),
        cad: String(formData.cad),
        appet: String(formData.appet),
        pe: String(formData.pe),
        ane: String(formData.ane)
      };

      await executePrediction(payload);
      navigate('/result');
    } catch (err) {
      console.error("Prediction submission error:", err);
      setErrorMsg(err.response?.data?.detail || "Screening service failed to complete. Please ensure backend is running.");
    }
  };

  const steps = [
    { id: 1, name: 'BASIC INFORMATION', short: 'Step 1' },
    { id: 2, name: 'BLOOD & URINE INFORMATION', short: 'Step 2' },
    { id: 3, name: 'HEALTH CONDITIONS', short: 'Step 3' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#FF6B00] mb-1">
          Patient CKD Risk Screening
        </span>
        <PageHeader 
          title="Check Your Health" 
          subtitle="Submit clinical parameters across 24 standard research attributes for machine learning risk screening."
        />
      </div>

      {/* Demo Profile Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-700">Demonstration Testing:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadLowRiskDemo}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
          >
            Demo/Test Profile: Healthy / Low-Risk
          </button>
          <button
            type="button"
            onClick={loadHighRiskDemo}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            Demo/Test Profile: High-Risk
          </button>
        </div>
      </div>

      {/* Progress Indicator: STEP 1 → STEP 2 → STEP 3 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
                    isActive 
                      ? 'text-[#FF6B00]' 
                      : isCompleted 
                        ? 'text-emerald-700' 
                        : 'text-gray-400'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive 
                      ? 'bg-[#FF6B00] text-white shadow-sm' 
                      : isCompleted 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-gray-100 text-gray-500'
                  }`}>
                    {step.id}
                  </span>
                  <div className="text-left hidden sm:block">
                    <div className="text-[10px] uppercase tracking-wider">{step.short}</div>
                    <div className="text-xs font-extrabold">{step.name}</div>
                  </div>
                </button>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 hidden sm:block ${
                    currentStep > step.id ? 'bg-emerald-400' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ========================================================= */}
        {/* SECTION 1: BASIC INFORMATION                              */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B00] font-bold text-xs flex items-center justify-center">1</span>
                <h3 className="text-sm font-bold text-gray-900">SECTION 1: BASIC INFORMATION</h3>
              </div>
              <span className="text-xs text-gray-400">3 Attributes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Age <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="e.g. 48"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none pr-14"
                    required
                  />
                  <span className="absolute right-3 text-xs font-semibold text-gray-400">years</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Normal clinical range: 1–100</p>
              </div>

              {/* Blood Pressure */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Blood Pressure <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="40"
                    max="220"
                    value={formData.bp}
                    onChange={(e) => handleChange('bp', e.target.value)}
                    placeholder="e.g. 80"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none pr-14"
                    required
                  />
                  <span className="absolute right-3 text-xs font-semibold text-gray-400">mmHg</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Diastolic resting pressure</p>
              </div>

              {/* Specific Gravity */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Specific Gravity <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.sg}
                  onChange={(e) => handleChange('sg', parseFloat(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#FF6B00] outline-none cursor-pointer"
                  required
                >
                  <option value={1.005}>1.005 (Very Low Concentration)</option>
                  <option value={1.010}>1.010 (Low Concentration)</option>
                  <option value={1.015}>1.015 (Mild)</option>
                  <option value={1.020}>1.020 (Normal)</option>
                  <option value={1.025}>1.025 (High Concentration)</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1">Urine concentration density</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#E05A00] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 2: BLOOD & URINE INFORMATION                      */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B00] font-bold text-xs flex items-center justify-center">2</span>
                <h3 className="text-sm font-bold text-gray-900">SECTION 2: BLOOD & URINE INFORMATION</h3>
              </div>
              <span className="text-xs text-gray-400">15 Lab Attributes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Albumin */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Albumin <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.al}
                  onChange={(e) => handleChange('al', parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#FF6B00] outline-none cursor-pointer"
                >
                  <option value={0}>0 (Normal / Negative)</option>
                  <option value={1}>1 (Trace / Mild)</option>
                  <option value={2}>2 (Moderate)</option>
                  <option value={3}>3 (High)</option>
                  <option value={4}>4 (Very High)</option>
                  <option value={5}>5 (Severe Microalbuminuria)</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-0.5">Urine protein level (0–5)</p>
              </div>

              {/* Sugar */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Sugar <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.su}
                  onChange={(e) => handleChange('su', parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#FF6B00] outline-none cursor-pointer"
                >
                  <option value={0}>0 (Normal / Negative)</option>
                  <option value={1}>1 (Trace)</option>
                  <option value={2}>2 (Moderate)</option>
                  <option value={3}>3 (High)</option>
                  <option value={4}>4 (Very High)</option>
                  <option value={5}>5 (Severe Glycosuria)</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-0.5">Urine sugar level (0–5)</p>
              </div>

              {/* Red Blood Cells */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Red Blood Cells (rbc) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.rbc}
                  onChange={(e) => handleChange('rbc', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#FF6B00] outline-none cursor-pointer"
                >
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-0.5">Urine microscopic sediment</p>
              </div>

              {/* Pus Cell */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Pus Cell (pc) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.pc}
                  onChange={(e) => handleChange('pc', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#FF6B00] outline-none cursor-pointer"
                >
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-0.5">Urinary pyuria indicator</p>
              </div>

              {/* Pus Cell Clumps */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Pus Cell Clumps <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.pcc}
                  onChange={(e) => handleChange('pcc', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#FF6B00] outline-none cursor-pointer"
                >
                  <option value="notpresent">Not Present</option>
                  <option value="present">Present</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-0.5">Infection agglutination</p>
              </div>

              {/* Bacteria */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Bacteria <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.ba}
                  onChange={(e) => handleChange('ba', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#FF6B00] outline-none cursor-pointer"
                >
                  <option value="notpresent">Not Present</option>
                  <option value="present">Present</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-0.5">Bacteriuria detection</p>
              </div>

              {/* Blood Glucose */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Blood Glucose <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="50"
                    max="500"
                    value={formData.bgr}
                    onChange={(e) => handleChange('bgr', e.target.value)}
                    placeholder="e.g. 120"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none pr-14"
                    required
                  />
                  <span className="absolute right-3 text-xs font-semibold text-gray-400">mg/dL</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Random blood sugar (bgr)</p>
              </div>

              {/* Blood Urea */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Blood Urea <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="400"
                    value={formData.bu}
                    onChange={(e) => handleChange('bu', e.target.value)}
                    placeholder="e.g. 36"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none pr-14"
                    required
                  />
                  <span className="absolute right-3 text-xs font-semibold text-gray-400">mg/dL</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Blood urea nitrogen (bu)</p>
              </div>

              {/* Serum Creatinine */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Serum Creatinine <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="30"
                    value={formData.sc}
                    onChange={(e) => handleChange('sc', e.target.value)}
                    placeholder="e.g. 1.2"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none pr-14"
                    required
                  />
                  <span className="absolute right-3 text-xs font-semibold text-gray-400">mg/dL</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Key renal clearance marker (sc)</p>
              </div>

              {/* Sodium */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Sodium <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    min="80"
                    max="180"
                    value={formData.sod}
                    onChange={(e) => handleChange('sod', e.target.value)}
                    placeholder="e.g. 138"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none pr-14"
                    required
                  />
                  <span className="absolute right-3 text-xs font-semibold text-gray-400">mEq/L</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Serum electrolyte (sod)</p>
              </div>

              {/* Potassium */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Potassium <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="15.0"
                    value={formData.pot}
                    onChange={(e) => handleChange('pot', e.target.value)}
                    placeholder="e.g. 4.5"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none pr-14"
                    required
                  />
                  <span className="absolute right-3 text-xs font-semibold text-gray-400">mEq/L</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Serum electrolyte (pot)</p>
              </div>

              {/* Hemoglobin */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Hemoglobin <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    min="3.0"
                    max="22.0"
                    value={formData.hemo}
                    onChange={(e) => handleChange('hemo', e.target.value)}
                    placeholder="e.g. 15.4"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none pr-14"
                    required
                  />
                  <span className="absolute right-3 text-xs font-semibold text-gray-400">g/dL</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Blood hemoglobin content (hemo)</p>
              </div>

              {/* Packed Cell Volume */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Packed Cell Volume <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="10"
                    max="65"
                    value={formData.pcv}
                    onChange={(e) => handleChange('pcv', e.target.value)}
                    placeholder="e.g. 44"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none pr-10"
                    required
                  />
                  <span className="absolute right-3 text-xs font-semibold text-gray-400">%</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Hematocrit level (pcv)</p>
              </div>

              {/* White Blood Cell Count */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  White Blood Cell Count <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="1500"
                    max="30000"
                    value={formData.wc}
                    onChange={(e) => handleChange('wc', e.target.value)}
                    placeholder="e.g. 7800"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none pr-16"
                    required
                  />
                  <span className="absolute right-3 text-xs font-semibold text-gray-400">cells/cu.mm</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Total leukocyte count (wc)</p>
              </div>

              {/* Red Blood Cell Count */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Red Blood Cell Count <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="8.5"
                    value={formData.rc}
                    onChange={(e) => handleChange('rc', e.target.value)}
                    placeholder="e.g. 5.2"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none pr-14"
                    required
                  />
                  <span className="absolute right-3 text-xs font-semibold text-gray-400">mil/cmm</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Erythrocyte count (rc)</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 1</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#E05A00] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                <span>Continue to Step 3</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 3: HEALTH CONDITIONS                              */}
        {/* ========================================================= */}
        {currentStep === 3 && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B00] font-bold text-xs flex items-center justify-center">3</span>
                <h3 className="text-sm font-bold text-gray-900">SECTION 3: HEALTH CONDITIONS</h3>
              </div>
              <span className="text-xs text-gray-400">6 Clinical Symptoms</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Hypertension */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-gray-800">
                  Hypertension (High BP)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('htn', 'yes')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formData.htn === 'yes'
                        ? 'bg-[#FF6B00] text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('htn', 'no')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formData.htn === 'no'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Diabetes Mellitus */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-gray-800">
                  Diabetes Mellitus
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('dm', 'yes')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formData.dm === 'yes'
                        ? 'bg-[#FF6B00] text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('dm', 'no')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formData.dm === 'no'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Coronary Artery Disease */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-gray-800">
                  Coronary Artery Disease
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('cad', 'yes')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formData.cad === 'yes'
                        ? 'bg-[#FF6B00] text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('cad', 'no')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formData.cad === 'no'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Appetite */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-gray-800">
                  Appetite
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('appet', 'good')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formData.appet === 'good'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Good
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('appet', 'poor')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formData.appet === 'poor'
                        ? 'bg-[#FF6B00] text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Poor
                  </button>
                </div>
              </div>

              {/* Pedal Edema */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-gray-800">
                  Pedal Edema (Swelling)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('pe', 'yes')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formData.pe === 'yes'
                        ? 'bg-[#FF6B00] text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('pe', 'no')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formData.pe === 'no'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Anemia */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-gray-800">
                  Anemia (Low RBC)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('ane', 'yes')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formData.ane === 'yes'
                        ? 'bg-[#FF6B00] text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('ane', 'no')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formData.ane === 'no'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 2</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FF6B00] hover:bg-[#E05A00] text-white font-extrabold text-sm shadow-lg shadow-orange-500/30 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Activity className="w-5 h-5" />
                <span>{loading ? 'ANALYZING CLINICAL DATA...' : 'PREDICT CKD RISK'}</span>
              </button>
            </div>
          </div>
        )}

      </form>

      {/* Prominent Medical Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Medical Disclaimer:</span> This application is intended for educational and research screening purposes only. It is not a medical diagnosis or treatment tool. Consult a qualified healthcare professional for medical advice.
        </div>
      </div>
    </div>
  );
}
