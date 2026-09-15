import React from 'react';

export const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 flex-wrap no-print">
      <div>
        <h1 className="text-2xl font-bold text-[#18181B] tracking-tight">{title}</h1>
        {subtitle && <div className="text-sm text-[#52525B] mt-1">{subtitle}</div>}
      </div>
      {actions && <div className="flex items-center gap-2.5 flex-shrink-0">{actions}</div>}
    </div>
  );
};

export default PageHeader;
