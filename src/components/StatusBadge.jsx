import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const StatusBadge = ({ variant = 'green', text }) => {
  const styles = {
    green: 'bg-[#EAF7EE] text-[#1A7F37] border-transparent',
    red: 'bg-[#FEE2E2] text-[#DC2626] border-transparent',
    orange: 'bg-[#FFF1E5] text-[#E05A00] border-transparent',
    gray: 'bg-[#FAFAFA] text-[#52525B] border-[#E4E4E7]',
  };

  const renderIcon = () => {
    if (variant === 'green') return <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />;
    if (variant === 'red') return <ShieldAlert className="w-3.5 h-3.5 stroke-[2.5]" />;
    if (variant === 'orange') return <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />;
    return null;
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant] || styles.gray}`}>
      {renderIcon()}
      <span>{text}</span>
    </span>
  );
};

export default StatusBadge;
