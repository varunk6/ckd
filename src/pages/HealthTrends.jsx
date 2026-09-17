import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  HeartPulse, 
  FlaskConical, 
  Flame, 
  Moon, 
  Activity, 
  Zap,
  LineChart as LineChartIcon
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

export default function HealthTrends() {
  const { bpReadings, labResults, wearableLogs } = usePrediction();
  const [filterRange, setFilterRange] = useState('30'); // '7', '30', '90'

  // Filter helper based on days
  const filterByDays = (items, dateKey, days) => {
    if (!items || items.length === 0) return [];
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - parseInt(days));

    return items.filter(item => {
      if (!item[dateKey]) return true;
      const itemDate = new Date(item[dateKey]);
      return itemDate >= cutoff;
    });
  };

  // Filter datasets
  const filteredBP = filterByDays([...bpReadings].reverse(), 'date', filterRange);
  const filteredLab = filterByDays([...labResults].reverse(), 'test_date', filterRange);
  const filteredWearable = filterByDays([...wearableLogs].reverse(), 'log_date', filterRange);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Longitudinal Health & Clinical Trends" 
          subtitle="Multi-parameter temporal analytics tracking blood pressure, renal filtration, blood glucose, cardiac metrics, and sleep trajectories."
        />

        {/* Date Range Filter Selector */}
        <div className="inline-flex items-center p-1 bg-white border border-gray-200 rounded-xl shadow-xs shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setFilterRange('7')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterRange === '7' ? 'bg-[#FF6B00] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setFilterRange('30')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterRange === '30' ? 'bg-[#FF6B00] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setFilterRange('90')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterRange === '90' ? 'bg-[#FF6B00] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            3 Months
          </button>
        </div>
      </div>

      {/* Grid of 8 Telemetry Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Blood Pressure Trend */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-[#FF6B00]" />
              Blood Pressure Trend (mmHg)
            </h3>
            <span className="text-[10px] text-gray-400 font-semibold">{filteredBP.length} Data Points</span>
          </div>

          {filteredBP.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredBP}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                  <YAxis domain={[40, 200]} tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="systolic" stroke="#FF6B00" strokeWidth={2} name="Systolic" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="diastolic" stroke="#3B82F6" strokeWidth={2} name="Diastolic" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4 border border-dashed border-gray-200 rounded-xl">
              <HeartPulse className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-xs font-semibold text-gray-500">No blood pressure trend data available.</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Record readings in the Blood Pressure module.</p>
            </div>
          )}
        </div>

        {/* 2. Serum Creatinine Trend */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-rose-500" />
              Serum Creatinine Trend (mg/dL)
            </h3>
            <span className="text-[10px] text-gray-400 font-semibold">{filteredLab.filter(l => l.sc !== null).length} Data Points</span>
          </div>

          {filteredLab.filter(l => l.sc !== null).length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredLab}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="test_date" tick={{ fontSize: 9 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sc" stroke="#EF4444" fill="#EF444422" name="Creatinine (mg/dL)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4 border border-dashed border-gray-200 rounded-xl">
              <FlaskConical className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-xs font-semibold text-gray-500">No creatinine trend data available.</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Add lab results in Kidney Health module.</p>
            </div>
          )}
        </div>

        {/* 3. eGFR Trajectory */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              eGFR Glomerular Filtration Trajectory
            </h3>
            <span className="text-[10px] text-gray-400 font-semibold">{filteredLab.filter(l => l.egfr !== null).length} Data Points</span>
          </div>

          {filteredLab.filter(l => l.egfr !== null).length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredLab}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="test_date" tick={{ fontSize: 9 }} />
                  <YAxis domain={[0, 140]} tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="egfr" stroke="#10B981" strokeWidth={2.5} name="eGFR (mL/min)" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4 border border-dashed border-gray-200 rounded-xl">
              <TrendingUp className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-xs font-semibold text-gray-500">No eGFR trend data available.</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Record lab test eGFR in Kidney Health module.</p>
            </div>
          )}
        </div>

        {/* 4. Blood Glucose Trend */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              Blood Glucose Trend (bgr mg/dL)
            </h3>
            <span className="text-[10px] text-gray-400 font-semibold">{filteredLab.filter(l => l.bgr !== null).length} Data Points</span>
          </div>

          {filteredLab.filter(l => l.bgr !== null).length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredLab}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="test_date" tick={{ fontSize: 9 }} />
                  <YAxis domain={[50, 400]} tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="bgr" stroke="#F59E0B" strokeWidth={2} name="Blood Glucose (mg/dL)" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4 border border-dashed border-gray-200 rounded-xl">
              <Activity className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-xs font-semibold text-gray-500">No blood glucose trend data available.</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Record blood glucose in Kidney Health module.</p>
            </div>
          )}
        </div>

        {/* 5. Heart Rate Trajectory */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              Wearable Heart Rate Trajectory (bpm)
            </h3>
            <span className="text-[10px] text-gray-400 font-semibold">{filteredWearable.filter(w => w.heart_rate !== null).length} Data Points</span>
          </div>

          {filteredWearable.filter(w => w.heart_rate !== null).length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredWearable}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                  <YAxis domain={[40, 180]} tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="heart_rate" stroke="#EF4444" strokeWidth={2} name="Heart Rate (bpm)" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4 border border-dashed border-gray-200 rounded-xl">
              <HeartPulse className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-xs font-semibold text-gray-500">No heart rate trend data available.</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Log heart rate in Health Monitoring module.</p>
            </div>
          )}
        </div>

        {/* 6. Daily Steps Trajectory */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FF6B00]" />
              Daily Step Activity Trajectory
            </h3>
            <span className="text-[10px] text-gray-400 font-semibold">{filteredWearable.filter(w => w.steps !== null).length} Data Points</span>
          </div>

          {filteredWearable.filter(w => w.steps !== null).length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredWearable}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="steps" stroke="#FF6B00" fill="#FF6B0022" name="Steps" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4 border border-dashed border-gray-200 rounded-xl">
              <Flame className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-xs font-semibold text-gray-500">No step activity trend data available.</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Log step counts in Health Monitoring module.</p>
            </div>
          )}
        </div>

        {/* 7. Sleep Duration Trend */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-500" />
              Sleep Duration Trend (hours)
            </h3>
            <span className="text-[10px] text-gray-400 font-semibold">{filteredWearable.filter(w => w.sleep_duration !== null).length} Data Points</span>
          </div>

          {filteredWearable.filter(w => w.sleep_duration !== null).length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredWearable}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                  <YAxis domain={[0, 14]} tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sleep_duration" stroke="#6366F1" strokeWidth={2.5} name="Sleep (hrs)" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4 border border-dashed border-gray-200 rounded-xl">
              <Moon className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-xs font-semibold text-gray-500">No sleep trend data available.</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Log sleep metrics in Health Monitoring module.</p>
            </div>
          )}
        </div>

        {/* 8. Heart Rate Variability (HRV) Trend */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              Heart Rate Variability HRV Trend (ms)
            </h3>
            <span className="text-[10px] text-gray-400 font-semibold">{filteredWearable.filter(w => w.hrv !== null).length} Data Points</span>
          </div>

          {filteredWearable.filter(w => w.hrv !== null).length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredWearable}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                  <YAxis domain={[0, 150]} tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="hrv" stroke="#10B981" fill="#10B98122" name="HRV (ms)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4 border border-dashed border-gray-200 rounded-xl">
              <Zap className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-xs font-semibold text-gray-500">No HRV trend data available.</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Log HRV in Health Monitoring module.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
