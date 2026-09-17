import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { usePrediction } from '../context/PredictionContext';

export default function Prediction() {
  const navigate = useNavigate();
  const { executePrediction, loading } = usePrediction();
  const [errorMsg, setErrorMsg] = useState(null);

  // Form state initialized with standard clinical defaults
  const [formData, setFormData] = useState({
    age: 48,
    bp: 80,
    sg: 1.020,
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

  // Preset: High Risk Patient Profile
  const loadHighRiskPreset = () => {
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

  // Preset: Low Risk Patient Profile
  const loadLowRiskPreset = () => {
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
    e.preventDefault();
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Check Your Health" 
        subtitle="Enter your basic health information, blood & kidney test values, and health conditions for AI screening."
      />

      {/* Preset Action Buttons for Easy Testing */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <span className="text-xs font-bold text-gray-600">Quick Test Profiles:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadLowRiskPreset}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
          >
            Load Healthy / Low Risk Profile
          </button>
          <button
            type="button"
            onClick={loadHighRiskPreset}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            Load High Risk Profile
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B00] font-bold text-xs flex items-center justify-center">1</span>
            <h3 className="text-sm font-bold text-gray-900">SECTION 1: Basic Information</h3>
          </div>

          <div className="w-full md:w-1/2">
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
                required
              />
              <span className="absolute right-3 text-xs font-semibold text-gray-400">years</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Blood & Kidney Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B00] font-bold text-xs flex items-center justify-center">2</span>
            <h3 className="text-sm font-bold text-gray-900">SECTION 2: Blood & Kidney Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* BP */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Blood Pressure <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="40"
                  max="240"
                  value={formData.bp}
                  onChange={(e) => handleChange('bp', e.target.value)}
                  placeholder="e.g. 80"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none pr-14"
                  required
                />
                <span className="absolute right-3 text-xs font-semibold text-gray-400">mmHg</span>
              </div>
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
                  min="1"
                  max="15"
                  value={formData.pot}
                  onChange={(e) => handleChange('pot', e.target.value)}
                  placeholder="e.g. 4.5"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none pr-14"
                  required
                />
                <span className="absolute right-3 text-xs font-semibold text-gray-400">mEq/L</span>
              </div>
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
                  min="2"
                  max="25"
                  value={formData.hemo}
                  onChange={(e) => handleChange('hemo', e.target.value)}
                  placeholder="e.g. 15.4"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none pr-14"
                  required
                />
                <span className="absolute right-3 text-xs font-semibold text-gray-400">g/dL</span>
              </div>
            </div>

            {/* Albumin */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Albumin Level <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.al}
                onChange={(e) => handleChange('al', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none bg-white"
              >
                <option value="0">Grade 0 (Normal)</option>
                <option value="1">Grade 1 (Trace)</option>
                <option value="2">Grade 2 (+)</option>
                <option value="3">Grade 3 (++)</option>
                <option value="4">Grade 4 (+++)</option>
                <option value="5">Grade 5 (++++)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: Health Conditions */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B00] font-bold text-xs flex items-center justify-center">3</span>
            <h3 className="text-sm font-bold text-gray-900">SECTION 3: Health Conditions</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Hypertension</label>
              <select
                value={formData.htn}
                onChange={(e) => handleChange('htn', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none bg-white font-semibold"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Diabetes Mellitus</label>
              <select
                value={formData.dm}
                onChange={(e) => handleChange('dm', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none bg-white font-semibold"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Heart Disease (CAD)</label>
              <select
                value={formData.cad}
                onChange={(e) => handleChange('cad', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none bg-white font-semibold"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Appetite</label>
              <select
                value={formData.appet}
                onChange={(e) => handleChange('appet', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none bg-white font-semibold"
              >
                <option value="good">Good</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Pedal Edema (Swelling)</label>
              <select
                value={formData.pe}
                onChange={(e) => handleChange('pe', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none bg-white font-semibold"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Anemia</label>
              <select
                value={formData.ane}
                onChange={(e) => handleChange('ane', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none bg-white font-semibold"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Action Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#FF6B00] hover:bg-[#E05A00] text-white text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
          >
            <Stethoscope className="w-5 h-5" />
            <span>{loading ? 'Processing Screening...' : 'Predict CKD Risk'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
