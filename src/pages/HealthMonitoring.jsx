import React, { useState } from 'react';
import { 
  Watch, 
  Plus, 
  Flame, 
  Heart, 
  Moon, 
  Zap, 
  Bell, 
  Trash2, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { usePrediction } from '../context/PredictionContext';
import PageHeader from '../components/PageHeader';

export default function HealthMonitoring() {
  const { wearableLogs, addWearableLog, removeWearableLog } = usePrediction();

  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [steps, setSteps] = useState('');
  const [activeMinutes, setActiveMinutes] = useState('');
  const [calories, setCalories] = useState('');
  const [sedentaryAlerts, setSedentaryAlerts] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [minHr, setMinHr] = useState('');
  const [maxHr, setMaxHr] = useState('');
  const [hrv, setHrv] = useState('');
  const [sleepDuration, setSleepDuration] = useState('');
  const [awakeDuration, setAwakeDuration] = useState('');
  const [sleepScore, setSleepScore] = useState('');
  const [stressLevel, setStressLevel] = useState('');

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await addWearableLog({
        log_date: logDate,
        steps: steps ? parseInt(steps) : null,
        active_minutes: activeMinutes ? parseInt(activeMinutes) : null,
        calories: calories ? parseInt(calories) : null,
        sedentary_alerts: sedentaryAlerts ? parseInt(sedentaryAlerts) : null,
        heart_rate: heartRate ? parseInt(heartRate) : null,
        min_hr: minHr ? parseInt(minHr) : null,
        max_hr: maxHr ? parseInt(maxHr) : null,
        hrv: hrv ? parseInt(hrv) : null,
        sleep_duration: sleepDuration ? parseFloat(sleepDuration) : null,
        awake_duration: awakeDuration ? parseFloat(awakeDuration) : null,
        sleep_score: sleepScore ? parseInt(sleepScore) : null,
        stress_level: stressLevel ? parseInt(stressLevel) : null,
      });
      setMsg({ type: 'success', text: 'Wearable health telemetry record saved successfully.' });
      setTimeout(() => setMsg(null), 3000);
      setSteps('');
      setHeartRate('');
      setSleepDuration('');
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save wearable record.' });
    } finally {
      setSaving(false);
    }
  };

  const latestLog = wearableLogs.length > 0 ? wearableLogs[0] : null;

  // Chronological chart data
  const chartData = [...wearableLogs].reverse().map(item => ({
    date: item.log_date,
    steps: item.steps || null,
    heart_rate: item.heart_rate || null,
    sleep_duration: item.sleep_duration || null,
    stress_level: item.stress_level || null,
    hrv: item.hrv || null
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Continuous Health & Wearable Monitoring"
        subtitle="Real-time telemetry integration for activity, cardiac metrics, sleep quality, stress levels, and autonomic vitals."
      />

      {/* Top 5 Section Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Activity */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Activity</span>
            <Flame className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">
            {latestLog && latestLog.steps !== null ? latestLog.steps.toLocaleString() : '--'}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {latestLog && latestLog.calories !== null ? `${latestLog.calories} kcal burned` : 'Steps today'}
          </p>
        </div>

        {/* Card 2: Heart Rate */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Heart Rate</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">
            {latestLog && latestLog.heart_rate !== null ? `${latestLog.heart_rate} bpm` : '--'}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {latestLog && latestLog.min_hr !== null && latestLog.max_hr !== null 
              ? `Min: ${latestLog.min_hr} | Max: ${latestLog.max_hr}` 
              : 'Resting & Active HR'}
          </p>
        </div>

        {/* Card 3: Sleep */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sleep</span>
            <Moon className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">
            {latestLog && latestLog.sleep_duration !== null ? `${latestLog.sleep_duration} hrs` : '--'}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {latestLog && latestLog.sleep_score !== null ? `Sleep Score: ${latestLog.sleep_score}/100` : 'Duration & Quality'}
          </p>
        </div>

        {/* Card 4: Stress */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Stress Index</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">
            {latestLog && latestLog.stress_level !== null ? `${latestLog.stress_level} / 100` : '--'}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {latestLog && latestLog.stress_level !== null 
              ? (latestLog.stress_level < 40 ? 'Low Stress' : latestLog.stress_level < 70 ? 'Moderate Stress' : 'High Stress') 
              : 'Device Stress Level'}
          </p>
        </div>

        {/* Card 5: Vitals / HRV */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">HRV Vitals</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">
            {latestLog && latestLog.hrv !== null ? `${latestLog.hrv} ms` : '--'}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {latestLog && latestLog.sedentary_alerts !== null ? `Sedentary Alerts: ${latestLog.sedentary_alerts}` : 'Heart Rate Variability'}
          </p>
        </div>
      </div>

      {/* Log / Import Wearable Data Form */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Plus className="w-4 h-4 text-[#FF6B00]" />
          Log Wearable & Fitness Tracker Telemetry
        </h3>

        {msg && (
          <div className={`p-3 rounded-lg text-xs flex items-center gap-2 mb-4 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-rose-600" />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Log Date *</label>
            <input 
              type="date" 
              value={logDate} 
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Total Steps</label>
              <input 
                type="number" 
                value={steps} onChange={(e) => setSteps(e.target.value)}
                placeholder="e.g. 8450"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Active Duration (mins)</label>
              <input 
                type="number" 
                value={activeMinutes} onChange={(e) => setActiveMinutes(e.target.value)}
                placeholder="e.g. 45"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Energy Spent (kcal)</label>
              <input 
                type="number" 
                value={calories} onChange={(e) => setCalories(e.target.value)}
                placeholder="e.g. 480"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sedentary Alerts</label>
              <input 
                type="number" 
                value={sedentaryAlerts} onChange={(e) => setSedentaryAlerts(e.target.value)}
                placeholder="e.g. 3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Current HR (bpm)</label>
              <input 
                type="number" 
                value={heartRate} onChange={(e) => setHeartRate(e.target.value)}
                placeholder="e.g. 72"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Min / Max HR (bpm)</label>
              <div className="flex gap-2">
                <input 
                  type="number" placeholder="Min"
                  value={minHr} onChange={(e) => setMinHr(e.target.value)}
                  className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#FF6B00] outline-none"
                />
                <input 
                  type="number" placeholder="Max"
                  value={maxHr} onChange={(e) => setMaxHr(e.target.value)}
                  className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#FF6B00] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">HRV (ms)</label>
              <input 
                type="number" 
                value={hrv} onChange={(e) => setHrv(e.target.value)}
                placeholder="e.g. 52"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sleep Duration (hrs)</label>
              <input 
                type="number" step="0.1" 
                value={sleepDuration} onChange={(e) => setSleepDuration(e.target.value)}
                placeholder="e.g. 7.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Awake Duration (mins)</label>
              <input 
                type="number" 
                value={awakeDuration} onChange={(e) => setAwakeDuration(e.target.value)}
                placeholder="e.g. 25"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sleep Score (0-100)</label>
              <input 
                type="number" 
                value={sleepScore} onChange={(e) => setSleepScore(e.target.value)}
                placeholder="e.g. 85"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Stress Level (0-100)</label>
              <input 
                type="number" 
                value={stressLevel} onChange={(e) => setStressLevel(e.target.value)}
                placeholder="e.g. 32"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 px-4 bg-[#FF6B00] hover:bg-[#E05A00] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Wearable Entry'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Daily Steps & Heart Rate Charts */}
      {wearableLogs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Steps Chart */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FF6B00]" />
              Daily Step Count Trajectory
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="steps" fill="#FF6B00" radius={[4, 4, 0, 0]} name="Steps" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sleep & Heart Rate Chart */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-500" />
              Sleep Duration & Heart Rate
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sleep_duration" stroke="#6366F1" fill="#6366F122" name="Sleep (hrs)" />
                  <Area type="monotone" dataKey="heart_rate" stroke="#EF4444" fill="#EF444411" name="Heart Rate (bpm)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center shadow-sm">
          <Watch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-gray-800">No wearable data available.</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Log wearable fitness data or sync device logs using the form above to track step counts, heart rate zones, sleep efficiency, and stress indices.
          </p>
        </div>
      )}

      {/* History Log Table */}
      {wearableLogs.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Wearable Activity Log</h3>
            <span className="text-xs font-semibold text-gray-500">{wearableLogs.length} Logged Entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Log Date</th>
                  <th className="px-4 py-3">Steps</th>
                  <th className="px-4 py-3">Heart Rate</th>
                  <th className="px-4 py-3">Sleep Duration</th>
                  <th className="px-4 py-3">Sleep Score</th>
                  <th className="px-4 py-3">Stress Level</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {wearableLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.log_date}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{item.steps !== null ? item.steps.toLocaleString() : '--'}</td>
                    <td className="px-4 py-3">{item.heart_rate !== null ? `${item.heart_rate} bpm` : '--'}</td>
                    <td className="px-4 py-3 font-semibold text-indigo-600">{item.sleep_duration !== null ? `${item.sleep_duration} hrs` : '--'}</td>
                    <td className="px-4 py-3">{item.sleep_score !== null ? `${item.sleep_score}/100` : '--'}</td>
                    <td className="px-4 py-3">{item.stress_level !== null ? `${item.stress_level}/100` : '--'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => removeWearableLog(item.id)}
                        className="p-1 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Log"
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
