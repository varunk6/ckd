import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, AlertTriangle, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
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

  // High Risk Preset Patient Profile
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

  // Low Risk Preset Patient Profile
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
      await executePrediction({
        ...formData,
        age: parseFloat(formData.age),
        bp: parseFloat(formData.bp),
        sg: parseFloat(formData.sg),
        al: parseFloat(formData.al),
        su: parseFloat(formData.su),
        bgr: parseFloat(formData.bgr),
        bu: parseFloat(formData.bu),
        sc: parseFloat(formData.sc),
        sod: parseFloat(formData.sod),
        pot: parseFloat(formData.pot),
        hemo: parseFloat(formData.hemo),
        pcv: parseFloat(formData.pcv),
        wc: parseFloat(formData.wc),
        rc: parseFloat(formData.rc)
      });
      navigate('/result');
    } catch (err) {
      console.error("Prediction submission error:", err);
      setErrorMsg(err.response?.data?.detail || err.message || "Prediction execution failed.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Patient CKD Risk Screening" 
        subtitle="Submit patient clinical parameters to evaluate risk stratification against the best trained machine learning model with instant SHAP explanations."
      />

      {/* Preset Action Buttons */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Load Sample Clinical Profiles:
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadHighRiskPreset}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 hover:bg-rose-200 transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            High Risk Sample (Patient A)
          </button>
          <button
            type="button"
            onClick={loadLowRiskPreset}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Low Risk Sample (Patient B)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Demographics & Blood Metrics */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-2">
            Section 1: Demographics & Blood Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Age (years)</label>
              <input 
                type="number" 
                min={1} 
                max={120} 
                value={formData.age} 
                onChange={(e) => handleChange('age', e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Blood Pressure (mmHg)</label>
              <input 
                type="number" 
                min={40} 
                max={200} 
                value={formData.bp} 
                onChange={(e) => handleChange('bp', e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Blood Glucose Random (mg/dl)</label>
              <input 
                type="number" 
                min={50} 
                max={600} 
                value={formData.bgr} 
                onChange={(e) => handleChange('bgr', e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Blood Urea (mg/dl)</label>
              <input 
                type="number" 
                step="0.1"
                min={5} 
                max={400} 
                value={formData.bu} 
                onChange={(e) => handleChange('bu', e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Serum Creatinine (mg/dl)</label>
              <input 
                type="number" 
                step="0.1"
                min={0.1} 
                max={30.0} 
                value={formData.sc} 
                onChange={(e) => handleChange('sc', e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Hemoglobin (gms)</label>
              <input 
                type="number" 
                step="0.1"
                min={3.0} 
                max={20.0} 
                value={formData.hemo} 
                onChange={(e) => handleChange('hemo', e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Packed Cell Volume (%)</label>
              <input 
                type="number" 
                min={10} 
                max={60} 
                value={formData.pcv} 
                onChange={(e) => handleChange('pcv', e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">White Blood Cell Count</label>
              <input 
                type="number" 
                min={1000} 
                max={30000} 
                value={formData.wc} 
                onChange={(e) => handleChange('wc', e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Red Blood Cell Count</label>
              <input 
                type="number" 
                step="0.1"
                min={1.0} 
                max={10.0} 
                value={formData.rc} 
                onChange={(e) => handleChange('rc', e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Urine Analysis */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-2">
            Section 2: Urine Analysis & Electrolytes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Specific Gravity (sg)</label>
              <select 
                value={formData.sg} 
                onChange={(e) => handleChange('sg', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
              >
                <option value={1.005}>1.005</option>
                <option value={1.010}>1.010</option>
                <option value={1.015}>1.015</option>
                <option value={1.020}>1.020</option>
                <option value={1.025}>1.025</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Albumin Level (0 - 5)</label>
              <select 
                value={formData.al} 
                onChange={(e) => handleChange('al', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
              >
                {[0, 1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Sugar Level (0 - 5)</label>
              <select 
                value={formData.su} 
                onChange={(e) => handleChange('su', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
              >
                {[0, 1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Red Blood Cells (rbc)</label>
              <select 
                value={formData.rbc} 
                onChange={(e) => handleChange('rbc', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
              >
                <option value="normal">normal</option>
                <option value="abnormal">abnormal</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Pus Cells (pc)</label>
              <select 
                value={formData.pc} 
                onChange={(e) => handleChange('pc', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
              >
                <option value="normal">normal</option>
                <option value="abnormal">abnormal</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Pus Cell Clumps (pcc)</label>
              <select 
                value={formData.pcc} 
                onChange={(e) => handleChange('pcc', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
              >
                <option value="notpresent">notpresent</option>
                <option value="present">present</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Symptoms & Medical History */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-2">
            Section 3: Medical History & Symptoms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Hypertension (htn)</label>
              <select 
                value={formData.htn} 
                onChange={(e) => handleChange('htn', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
              >
                <option value="no">no</option>
                <option value="yes">yes</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Diabetes Mellitus (dm)</label>
              <select 
                value={formData.dm} 
                onChange={(e) => handleChange('dm', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
              >
                <option value="no">no</option>
                <option value="yes">yes</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Coronary Artery Disease (cad)</label>
              <select 
                value={formData.cad} 
                onChange={(e) => handleChange('cad', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
              >
                <option value="no">no</option>
                <option value="yes">yes</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Appetite (appet)</label>
              <select 
                value={formData.appet} 
                onChange={(e) => handleChange('appet', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
              >
                <option value="good">good</option>
                <option value="poor">poor</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Pedal Edema (pe)</label>
              <select 
                value={formData.pe} 
                onChange={(e) => handleChange('pe', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
              >
                <option value="no">no</option>
                <option value="yes">yes</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Anemia (ane)</label>
              <select 
                value={formData.ane} 
                onChange={(e) => handleChange('ane', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
              >
                <option value="no">no</option>
                <option value="yes">yes</option>
              </select>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#FF6B00] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 text-base transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Running Inference Pipeline & SHAP Explainer...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Predict CKD Risk & Generate SHAP Explanation
            </>
          )}
        </button>
      </form>
    </div>
  );
}
