import React, { useState } from 'react';
import { 
  HeartPulse, 
  Plus, 
  Calendar, 
  Clock, 
  Trash2, 
  AlertCircle,
  TrendingUp,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { usePrediction } from '../context/PredictionContext';
import PageHeader from '../components/PageHeader';

export default function BloodPressure() {
  const { bpReadings, addBpReading, removeBpReading } = usePrediction();

  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [pulse, setPulse] = useState('72');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!systolic || !diastolic) return;
    setSaving(true);
    setMsg(null);
    try {
      await addBpReading({
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic),
        pulse: pulse ? parseInt(pulse) : null,
        date,
        time
      });
      setMsg({ type: 'success', text: 'Blood pressure reading recorded successfully.' });
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save blood pressure reading.' });
    } finally {
      setSaving(false);
    }
  };

  const getBPCategory = (sys, dia) => {
    if (sys < 120 && dia < 80) return { label: 'Normal', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (sys <= 129 && dia < 80) return { label: 'Elevated', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (sys <= 139 || dia <= 89) return { label: 'Hypertension Stage 1', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { label: 'Hypertension Stage 2', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const latestReading = bpReadings.length > 0 ? bpReadings[0] : null;

  // Prepare chart data (reverse to chronological order)
  const chartData = [...bpReadings].reverse().map(item => ({
    displayDate: `${item.date} ${item.time || ''}`,
    systolic: item.systolic,
    diastolic: item.diastolic,
    pulse: item.pulse || null
  }));

  const last7DaysData = chartData.slice(-7);
  const last30DaysData = chartData.slice(-30);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Blood Pressure Management"
        subtitle="Record, monitor, and analyze systolic and diastolic blood pressure metrics over time."
      />

      {/* Top Banner & Latest Reading Metric */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest BP Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Latest Blood Pressure</span>
              <HeartPulse className="w-5 h-5 text-[#FF6B00]" />
            </div>
            {latestReading ? (
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-gray-900">{latestReading.systolic}/{latestReading.diastolic}</span>
                  <span className="text-sm text-gray-500 font-medium">mmHg</span>
                </div>
                {latestReading.pulse && (
                  <p className="text-xs text-gray-500 mt-1">Pulse: <span className="font-semibold text-gray-800">{latestReading.pulse} bpm</span></p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  {(() => {
                    const cat = getBPCategory(latestReading.systolic, latestReading.diastolic);
                    return (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${cat.color}`}>
                        {cat.label}
                      </span>
                    );
                  })()}
                  <span className="text-xs text-gray-400">Recorded: {latestReading.date} {latestReading.time}</span>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                <HeartPulse className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-500">No blood pressure readings yet.</p>
                <p className="text-xs text-gray-400 mt-1">Record your first reading using the form.</p>
              </div>
            )}
          </div>
          <div className="text-[11px] text-gray-400 mt-4 border-t border-gray-100 pt-3">
            Strict hypertension monitoring is critical for slowing CKD progression.
          </div>
        </div>

        {/* Record Blood Pressure Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Plus className="w-4 h-4 text-[#FF6B00]" />
            Record Blood Pressure
          </h3>

          {msg && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 mb-4 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
              {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Systolic (mmHg) *</label>
              <input 
                type="number" 
                min="60" 
                max="250"
                value={systolic} 
                onChange={(e) => setSystolic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none"
                placeholder="e.g. 120"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Diastolic (mmHg) *</label>
              <input 
                type="number" 
                min="40" 
                max="160"
                value={diastolic} 
                onChange={(e) => setDiastolic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none"
                placeholder="e.g. 80"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Pulse (bpm)</label>
              <input 
                type="number" 
                min="30" 
                max="200"
                value={pulse} 
                onChange={(e) => setPulse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none"
                placeholder="e.g. 72"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Time</label>
              <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2 md:col-span-1 flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2 px-4 bg-[#FF6B00] hover:bg-[#E05A00] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Reading'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Charts Section */}
      {bpReadings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Systolic & Diastolic Combined Trend */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF6B00]" />
              7-Day Blood Pressure Trend
            </h3>
            <p className="text-[11px] text-gray-500">
              Recent systolic and diastolic trends (mmHg).
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last7DaysData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="displayDate" tick={{ fontSize: 10 }} />
                  <YAxis domain={[50, 200]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="systolic" stroke="#FF6B00" strokeWidth={2.5} name="Systolic (mmHg)" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="diastolic" stroke="#3B82F6" strokeWidth={2.5} name="Diastolic (mmHg)" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 30-Day Extended Area Chart */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FF6B00]" />
              30-Day BP Distribution
            </h3>
            <p className="text-[11px] text-gray-500">
              Long-term systolic and diastolic trajectory.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last30DaysData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="displayDate" tick={{ fontSize: 10 }} />
                  <YAxis domain={[50, 200]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="systolic" stroke="#FF6B00" fill="#FF6B0022" name="Systolic" />
                  <Area type="monotone" dataKey="diastolic" stroke="#3B82F6" fill="#3B82F622" name="Diastolic" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center shadow-sm">
          <HeartPulse className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-gray-800">No blood pressure readings yet.</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Add blood pressure records using the form above to start tracking historical trends, systolic/diastolic charts, and cardiovascular telemetry.
          </p>
        </div>
      )}

      {/* History Table */}
      {bpReadings.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Blood Pressure History Log</h3>
            <span className="text-xs font-semibold text-gray-500">{bpReadings.length} Total Readings</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Systolic</th>
                  <th className="px-4 py-3">Diastolic</th>
                  <th className="px-4 py-3">Pulse</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bpReadings.map((item) => {
                  const cat = getBPCategory(item.systolic, item.diastolic);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900">{item.date} {item.time}</td>
                      <td className="px-4 py-3 font-bold text-gray-900">{item.systolic} <span className="text-[10px] text-gray-400 font-normal">mmHg</span></td>
                      <td className="px-4 py-3 font-bold text-gray-900">{item.diastolic} <span className="text-[10px] text-gray-400 font-normal">mmHg</span></td>
                      <td className="px-4 py-3">{item.pulse ? `${item.pulse} bpm` : '--'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cat.color}`}>
                          {cat.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => removeBpReading(item.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Reading"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
