import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldAlert } from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';

export const Header = () => {
  const { apiOnline } = usePrediction();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-[#E4E4E7] px-8 py-3.5 flex items-center justify-between no-print sticky top-0 z-10 shadow-xs">
      <div className="flex items-center gap-3">
        <img src="/logo-icon.svg" alt="CKD Predict Logo" className="w-6 h-6 object-contain shrink-0" />
        <h2 className="text-sm font-bold text-[#18181B]">
          CKD <span className="text-[#FF6B00]">Predict</span> Platform
        </h2>
        <span className="text-xs text-[#A1A1AA] hidden sm:inline">&bull;</span>
        <span className="text-xs text-[#52525B] font-medium hidden sm:inline">
          Smarter Screening. Healthier Tomorrow.
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAFAFA] border border-[#E4E4E7]">
          <span
            className={`w-2 h-2 rounded-full ${
              apiOnline ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          <span className={apiOnline ? 'text-emerald-700' : 'text-rose-600'}>
            {apiOnline ? 'Backend Connected' : 'Backend Disconnected'}
          </span>
        </div>

        <button
          onClick={() => navigate('/predict')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E05A00] transition-colors cursor-pointer"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>New Prediction</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
