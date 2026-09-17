import React from 'react';
import { History as HistoryIcon, Trash2, Calendar, Stethoscope, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { usePrediction } from '../context/PredictionContext';

export default function History() {
  const { history, deleteHistoryRecord, clearAllHistory } = usePrediction();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Prediction History" 
          subtitle="Review previous AI screening results saved securely in your local database history."
        />

        {history.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            Clear History
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Screening Records Log</h3>
            <span className="text-xs font-semibold text-gray-500">{history.length} Total Saved Screenings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3">Probability</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((item) => {
                  const isCkd = item.prediction === 'ckd';
                  const probPct = (item.probability * 100).toFixed(0);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 font-semibold text-gray-900">{item.timestamp}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          isCkd ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {isCkd ? 'Higher likelihood' : 'Lower likelihood'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-black text-gray-900">{probPct}%</td>
                      <td className="px-4 py-3.5 text-gray-600 font-medium">{item.features_json ? 'XGBoost / Best Model' : 'Active Model'}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => deleteHistoryRecord(item.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Record"
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
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center shadow-sm max-w-lg mx-auto space-y-3">
          <HistoryIcon className="w-12 h-12 text-gray-300 mx-auto" />
          <h4 className="text-base font-bold text-gray-800">No prediction history yet.</h4>
          <p className="text-xs text-gray-500">
            Completed AI screenings will appear here automatically with date, result, model-estimated likelihood, and model type.
          </p>
        </div>
      )}
    </div>
  );
}
