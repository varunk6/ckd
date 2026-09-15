import React from 'react';

export const DataTable = ({ columns, data, keyExtractor }) => {
  return (
    <div className="bg-white border border-[#E4E4E7] rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-[#E4E4E7]">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {data.map((item, rowIndex) => (
              <tr key={keyExtractor ? keyExtractor(item, rowIndex) : rowIndex} className="hover:bg-[#FAFAFA]/70 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-[#52525B]">
                    {col.render ? col.render(item, rowIndex) : item[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
