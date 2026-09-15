import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Database, AlertCircle, FileSpreadsheet, Activity, Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import api from '../services/api';

const COLORS = ['#FF6B00', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6'];

export default function DatasetAnalysis() {
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [classDist, setClassDist] = useState(null);
  const [edaFeatures, setEdaFeatures] = useState(null);
  const [correlationData, setCorrelationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEda() {
      try {
        const [info, dist, feat, corr] = await Promise.all([
          api.getDatasetInfo(),
          api.getClassDistribution(),
          api.getEdaFeatures(),
          api.getCorrelationMatrix()
        ]);
        setDatasetInfo(info);
        setClassDist(dist);
        setEdaFeatures(feat);
        setCorrelationData(corr);
      } catch (err) {
        console.error("Error loading EDA data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEda();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center space-y-3">
        <Activity className="w-8 h-8 text-[#FF6B00] animate-spin" />
        <p className="text-sm font-medium">Analyzing UCI Dataset statistics & correlations...</p>
      </div>
    );
  }

  // Class distribution data for Pie Chart
  const pieData = [
    { name: 'Chronic Kidney Disease (ckd)', value: classDist?.ckd || 250, color: '#FF6B00' },
    { name: 'Non-CKD (notckd)', value: classDist?.notckd || 150, color: '#10B981' }
  ];

  // Missing values data for Bar Chart
  const missingData = datasetInfo?.missing_summary 
    ? Object.entries(datasetInfo.missing_summary)
        .map(([feature, count]) => ({
          feature,
          count,
          percentage: datasetInfo.missing_percentage[feature] || 0
        }))
        .filter(item => item.count > 0)
        .sort((a, b) => b.count - a.count)
    : [];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Exploratory Data Analysis (EDA)" 
        subtitle="Statistical inspection, missing value profiles, class imbalance, and numerical feature correlations of the UCI Chronic Kidney Disease dataset."
      />

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Patient Records</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{datasetInfo?.total_records || 400}</div>
          <div className="text-[11px] text-gray-500 mt-1">Clinical instances evaluated</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Clinical Features</div>
          <div className="text-2xl font-bold text-[#FF6B00] mt-1">{datasetInfo?.total_features || 24}</div>
          <div className="text-[11px] text-gray-500 mt-1">14 numerical, 10 categorical</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Target Positive (CKD)</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">{classDist?.ckd || 250}</div>
          <div className="text-[11px] text-gray-500 mt-1">62.5% Majority Class</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Target Negative (Normal)</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{classDist?.notckd || 150}</div>
          <div className="text-[11px] text-gray-500 mt-1">37.5% Minority Class</div>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <Database className="w-5 h-5 text-[#FF6B00]" />
            Target Class Distribution
          </h3>
          <p className="text-xs text-gray-500">
            Imbalance ratio is approximately 1.67:1 (62.5% CKD vs 37.5% Normal), justifying synthetic oversampling (SMOTE).
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Missing Value Profiling Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#FF6B00]" />
            Missing Values Summary per Feature
          </h3>
          <p className="text-xs text-gray-500">
            Features with highest missing counts (e.g. Red Blood Cell Count, White Blood Cell Count) are handled via Median/Mode SimpleImputer.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={missingData.slice(0, 10)} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="feature" angle={-45} textAnchor="end" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#FF6B00" radius={[4, 4, 0, 0]} name="Missing Records" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Numerical Distributions Table */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#FF6B00]" />
          Numerical Feature Summary Statistics
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                <th className="p-3">Feature Key</th>
                <th className="p-3">Clinical Attribute</th>
                <th className="p-3">Min</th>
                <th className="p-3">Max</th>
                <th className="p-3">Mean</th>
                <th className="p-3">Median</th>
                <th className="p-3">Missing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {edaFeatures?.numerical_summary && Object.entries(edaFeatures.numerical_summary).map(([key, stat]) => (
                <tr key={key} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-3 font-bold text-[#FF6B00]">{key}</td>
                  <td className="p-3 text-gray-700 capitalize">{key.replace('_', ' ')}</td>
                  <td className="p-3 text-gray-600">{stat.min}</td>
                  <td className="p-3 text-gray-600">{stat.max}</td>
                  <td className="p-3 text-gray-800 font-medium">{stat.mean}</td>
                  <td className="p-3 text-gray-800 font-medium">{stat.median}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      stat.missing > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {stat.missing} missing
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
