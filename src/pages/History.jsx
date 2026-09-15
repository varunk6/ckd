import React, { useState } from 'react';
import { History as HistoryIcon, Trash2, Search, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { usePrediction } from '../context/PredictionContext';

export default function History() {
  const { history, deleteHistoryRecord, clearAllHistory, refreshData } = usePrediction();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const filteredHistory = history.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.id.toString().includes(term) ||
      (item.prediction || '').toLowerCase().includes(term) ||
      (item.risk_level || '').toLowerCase().includes(term) ||
      (item.age || '').toString().includes(term)
    );
  });

  const handleDelete = async (id) => {
    setDeletingId(id);
    await deleteHistoryRecord(id);
    setDeletingId(null);
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to permanently clear all prediction history records?")) {
      await clearAllHistory();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Prediction History & Audit Log" 
        subtitle="Persistent database records of patient risk evaluations logged in SQLite."
      />

      {/* Search & Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Record ID, Risk Tier, Age..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            className="px-3.5 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Log
          </button>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Clear History
            </button>
          )}
        </div>
      </div>

      {/* Audit Data Table */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-[#FF6B00]" />
            Recorded Audit Entries ({filteredHistory.length})
          </h3>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs bg-gray-50 rounded-xl">
            No matching prediction records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                  <th className="p-3">ID</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Age / BP</th>
                  <th className="p-3">Prediction</th>
                  <th className="p-3">Probability</th>
                  <th className="p-3">Risk Tier</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3 font-bold text-gray-900">#{row.id}</td>
                    <td className="p-3 text-gray-500">{row.created_at || 'Recent'}</td>
                    <td className="p-3 text-gray-800 font-medium">
                      {row.age ? `${row.age} yrs` : 'N/A'} | {row.bp ? `${row.bp} mmHg` : 'N/A'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.prediction === 'ckd' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {row.prediction === 'ckd' ? 'CKD Detected' : 'Normal'}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#FF6B00]">
                      {row.probability ? `${(row.probability * 100).toFixed(1)}%` : 'N/A'}
                    </td>
                    <td className="p-3 font-semibold text-gray-700">{row.risk_level || 'N/A'}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(row.id)}
                        disabled={deletingId === row.id}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
