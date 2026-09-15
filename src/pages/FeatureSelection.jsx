import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Sliders, CheckCircle2, Trophy, HelpCircle, Activity } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import api from '../services/api';

export default function FeatureSelection() {
  const [fsData, setFsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMethod, setActiveMethod] = useState('composite_score');

  useEffect(() => {
    async function loadFS() {
      try {
        const data = await api.getFeatureSelection();
        setFsData(data);
      } catch (err) {
        console.error("Error loading Feature Selection data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFS();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center space-y-3">
        <Activity className="w-8 h-8 text-[#FF6B00] animate-spin" />
        <p className="text-sm font-medium">Evaluating 6 Feature Selection algorithms...</p>
      </div>
    );
  }

  const summaryList = fsData?.summary || [];

  // Sort chart data based on active method selection
  const chartData = [...summaryList]
    .sort((a, b) => (b[activeMethod] || 0) - (a[activeMethod] || 0))
    .slice(0, 12);

  const methodsList = [
    { key: 'composite_score', label: 'Consensus Score (Aggregate)' },
    { key: 'correlation', label: 'Pearson Correlation' },
    { key: 'chi2_score', label: 'Chi-Square (χ²)' },
    { key: 'mutual_info', label: 'Mutual Information' },
    { key: 'lasso_coef', label: 'LASSO L1 Coefficient' },
    { key: 'variance', label: 'Variance Threshold' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Multi-Method Feature Selection" 
        subtitle="Comparing 6 algorithmic selection techniques to identify the most predictive clinical attributes for Chronic Kidney Disease."
      />

      {/* Method Selector Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-2">
        {methodsList.map((m) => (
          <button
            key={m.key}
            onClick={() => setActiveMethod(m.key)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeMethod === m.key
                ? 'bg-[#FF6B00] text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Feature Ranking Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FF6B00]" />
            Feature Importance Ranking: {methodsList.find(m => m.key === activeMethod)?.label}
          </h3>
          <span className="text-xs text-gray-400 font-medium">Top 12 Features</span>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="feature" angle={-45} textAnchor="end" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey={activeMethod} fill="#FF6B00" radius={[4, 4, 0, 0]} name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Comparison Table */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#FF6B00]" />
          Comprehensive Algorithmic Feature Score Matrix
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                <th className="p-3">Feature</th>
                <th className="p-3">Consensus Score</th>
                <th className="p-3">Correlation</th>
                <th className="p-3">Chi-Square (χ²)</th>
                <th className="p-3">Mutual Info</th>
                <th className="p-3">LASSO Coef</th>
                <th className="p-3">RFE Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {summaryList.map((row, idx) => (
                <tr key={row.feature} className={idx < 5 ? 'bg-orange-50/40 font-semibold' : 'hover:bg-gray-50'}>
                  <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                    {idx < 5 && <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span>}
                    {row.feature}
                  </td>
                  <td className="p-3 text-[#FF6B00] font-bold">{(row.composite_score || 0).toFixed(4)}</td>
                  <td className="p-3 text-gray-700">{(row.correlation || 0).toFixed(4)}</td>
                  <td className="p-3 text-gray-700">{(row.chi2_score || 0).toFixed(2)}</td>
                  <td className="p-3 text-gray-700">{(row.mutual_info || 0).toFixed(4)}</td>
                  <td className="p-3 text-gray-700">{(row.lasso_coef || 0).toFixed(4)}</td>
                  <td className="p-3 text-gray-700 font-mono">Rank {row.rfe_rank || 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
