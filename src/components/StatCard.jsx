import React from 'react';

export const StatCard = ({ number, label, subtext, icon: Icon }) => {
  return (
    <div className="bg-white border border-[#E4E4E7] rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-[#D4D4D8] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl font-bold font-mono text-[#18181B] tracking-tight">{number}</div>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-[#FAFAFA] border border-[#E4E4E7] flex items-center justify-center text-[#FF6B00]">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div>
        <div className="text-xs font-semibold text-[#52525B]">{label}</div>
        {subtext && <div className="text-[11px] text-[#A1A1AA] mt-0.5">{subtext}</div>}
      </div>
    </div>
  );
};

export default StatCard;
