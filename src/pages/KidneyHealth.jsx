import React, { useState } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Calendar, 
  Trash2, 
  AlertTriangle,
  TrendingUp,
  Activity,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { usePrediction } from '../context/PredictionContext';
import PageHeader from '../components/PageHeader';

export default function KidneyHealth() {
  const { labResults, addLabResult, removeLabResult } = usePrediction();

  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [sc, setSc] = useState('');
  const [bu, setBu] = useState('');
  const [egfr, setEgfr] = useState('');
  const [hemo, setHemo] = useState('');
  const [sod, setSod] = useState('');
  const [pot, setPot] = useState('');
  const [bgr, setBgr] = useState('');
  const [al, setAl] = useState('0');
  const [protein, setProtein] = useState('normal');
  const [rbc, setRbc] = useState('normal');
  const [wbc, setWbc] = useState('');

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await addLabResult({
        test_date: testDate,
        sc: sc ? parseFloat(sc) : null,
        bu: bu ? parseFloat(bu) : null,
        egfr: egfr ? parseFloat(egfr) : null,
        hemo: hemo ? parseFloat(hemo) : null,
        sod: sod ? parseFloat(sod) : null,
        pot: pot ? parseFloat(pot) : null,
        bgr: bgr ? parseFloat(bgr) : null,
        al: parseInt(al),
        protein,
        rbc,
        wbc: wbc ? parseFloat(wbc) : null
      });
      setMsg({ type: 'success', text: 'Laboratory test results saved successfully.' });
      setTimeout(() => setMsg(null), 3000);
      // Reset optional inputs
      setSc('');
      setBu('');
      setEgfr('');
      setHemo('');
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save lab results.' });
    } finally {
      setSaving(false);
    }
  };

  const latestResult = labResults.length > 0 ? labResults[0] : null;

  // Prepare chart data (reverse chronological)
  const chartData = [...labResults].reverse().map(item => ({
    date: item.test_date,
    sc: item.sc || null,
    bu: item.bu || null,
    egfr: item.egfr || null,
    hemo: item.hemo || null,
    bgr: item.bgr || null
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Kidney Health & Laboratory Telemetry" 
        subtitle="Track renal function panels, blood biomarkers, and urine test results stored securely in your health log."
      />

      {/* Prominent Medical Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold">Medical Laboratory Notice:</span> Laboratory values are recorded for patient health tracking and research monitoring purposes. This interface does not automatically provide a clinical medical diagnosis. Always review lab panels with a licensed physician.
        </div>
      </div>

      {/* Latest Result Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Kidney Function Panel */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Kidney Function Panel</h4>
            <FlaskConical className="w-4 h-4 text-[#FF6B00]" />
          </div>
          {latestResult ? (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Serum Creatinine:</span>
                <span className="font-bold text-gray-900">{latestResult.sc !== null ? `${latestResult.sc} mg/dL` : '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Blood Urea (BU):</span>
                <span className="font-bold text-gray-900">{latestResult.bu !== null ? `${latestResult.bu} mg/dL` : '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">eGFR:</span>
                <span className="font-bold text-[#FF6B00]">{latestResult.egfr !== null ? `${latestResult.egfr} mL/min/1.73m²` : '--'}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-4 text-center">No lab data recorded</p>
          )}
        </div>

        {/* Card 2: Blood Biomarkers */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Blood Tests Panel</h4>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          {latestResult ? (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Hemoglobin:</span>
                <span className="font-bold text-gray-900">{latestResult.hemo !== null ? `${latestResult.hemo} g/dL` : '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Blood Glucose (BGR):</span>
                <span className="font-bold text-gray-900">{latestResult.bgr !== null ? `${latestResult.bgr} mg/dL` : '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sodium / Potassium:</span>
                <span className="font-bold text-gray-900">{latestResult.sod !== null ? latestResult.sod : '--'} / {latestResult.pot !== null ? latestResult.pot : '--'} mEq/L</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-4 text-center">No lab data recorded</p>
          )}
        </div>

        {/* Card 3: Urine Analysis */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Urine Analysis Panel</h4>
            <FileSpreadsheet className="w-4 h-4 text-amber-500" />
          </div>
          {latestResult ? (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Albumin Level:</span>
                <span className="font-bold text-gray-900">{latestResult.al !== null ? `Grade ${latestResult.al}` : '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Protein:</span>
                <span className="font-bold capitalize text-gray-900">{latestResult.protein || '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">RBC / WBC:</span>
                <span className="font-bold text-gray-900">{latestResult.rbc || '--'} / {latestResult.wbc !== null ? latestResult.wbc : '--'}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-4 text-center">No lab data recorded</p>
          )}
        </div>
      </div>

      {/* Add Lab Result Form */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Plus className="w-4 h-4 text-[#FF6B00]" />
          Add Laboratory Result Record
        </h3>

        {msg && (
          <div className={`p-3 rounded-lg text-xs flex items-center gap-2 mb-4 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Date row */}
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Lab Test Date *</label>
            <input 
              type="date" 
              value={testDate} 
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
              required
            />
          </div>

          {/* Section 1: Kidney Function */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">1. Kidney Function Parameters</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Serum Creatinine (mg/dL)</label>
                <input 
                  type="number" step="0.1" 
                  value={sc} onChange={(e) => setSc(e.target.value)}
                  placeholder="e.g. 1.2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Blood Urea (mg/dL)</label>
                <input 
                  type="number" step="0.1" 
                  value={bu} onChange={(e) => setBu(e.target.value)}
                  placeholder="e.g. 36.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">eGFR (mL/min/1.73m²)</label>
                <input 
                  type="number" step="0.1" 
                  value={egfr} onChange={(e) => setEgfr(e.target.value)}
                  placeholder="e.g. 78.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Blood Tests */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">2. Blood Panels</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Hemoglobin (g/dL)</label>
                <input 
                  type="number" step="0.1" 
                  value={hemo} onChange={(e) => setHemo(e.target.value)}
                  placeholder="e.g. 13.2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Blood Glucose (mg/dL)</label>
                <input 
                  type="number" 
                  value={bgr} onChange={(e) => setBgr(e.target.value)}
                  placeholder="e.g. 110"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Sodium (mEq/L)</label>
                <input 
                  type="number" step="0.1" 
                  value={sod} onChange={(e) => setSod(e.target.value)}
                  placeholder="e.g. 138"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Potassium (mEq/L)</label>
                <input 
                  type="number" step="0.1" 
                  value={pot} onChange={(e) => setPot(e.target.value)}
                  placeholder="e.g. 4.2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Urine Tests */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">3. Urine Tests</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Albumin (0 - 5)</label>
                <select 
                  value={al} onChange={(e) => setAl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none bg-white"
                >
                  <option value="0">0 (Normal)</option>
                  <option value="1">1 (Microalbuminuria)</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 (Severe)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Protein</label>
                <select 
                  value={protein} onChange={(e) => setProtein(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none bg-white"
                >
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Red Blood Cells (RBC)</label>
                <select 
                  value={rbc} onChange={(e) => setRbc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none bg-white"
                >
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">WBC Count (/uL)</label>
                <input 
                  type="number" 
                  value={wbc} onChange={(e) => setWbc(e.target.value)}
                  placeholder="e.g. 7800"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="py-2.5 px-6 bg-[#FF6B00] hover:bg-[#E05A00] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Lab Result Record'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Lab Trends Chart */}
      {labResults.length > 0 ? (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#FF6B00]" />
            Renal Function & Biomarker Trends
          </h3>
          <p className="text-[11px] text-gray-500">
            Historical trajectory of eGFR (mL/min/1.73m²) and Serum Creatinine (mg/dL).
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" domain={[0, 150]} tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="egfr" stroke="#FF6B00" strokeWidth={2.5} name="eGFR (mL/min)" dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="sc" stroke="#EF4444" strokeWidth={2.5} name="Creatinine (mg/dL)" dot={{ r: 4 }} />
                <Line yAxisId="left" type="monotone" dataKey="hemo" stroke="#3B82F6" strokeWidth={2} name="Hemoglobin (g/dL)" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center shadow-sm">
          <FlaskConical className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-gray-800">No lab results recorded yet.</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Use the form above to save your laboratory test panels. Historical charts and trends will populate automatically as lab entries are saved.
          </p>
        </div>
      )}

      {/* History Table */}
      {labResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Laboratory Test History</h3>
            <span className="text-xs font-semibold text-gray-500">{labResults.length} Total Test Records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Test Date</th>
                  <th className="px-4 py-3">Creatinine</th>
                  <th className="px-4 py-3">Blood Urea</th>
                  <th className="px-4 py-3">eGFR</th>
                  <th className="px-4 py-3">Hemoglobin</th>
                  <th className="px-4 py-3">Albumin</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {labResults.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.test_date}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{item.sc !== null ? `${item.sc} mg/dL` : '--'}</td>
                    <td className="px-4 py-3">{item.bu !== null ? `${item.bu} mg/dL` : '--'}</td>
                    <td className="px-4 py-3 font-bold text-[#FF6B00]">{item.egfr !== null ? `${item.egfr} mL/min` : '--'}</td>
                    <td className="px-4 py-3">{item.hemo !== null ? `${item.hemo} g/dL` : '--'}</td>
                    <td className="px-4 py-3">{item.al !== null ? `Grade ${item.al}` : '--'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => removeLabResult(item.id)}
                        className="p-1 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Lab Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
