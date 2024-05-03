import React from 'react';
import { useState } from 'react';
import DetailPopup from './popupInfo';

interface TableProps {
    data: any[];
    columns: { key: string; label: string }[];
    onRowClick: (item: any) => void;
  }
  
  const DynamicTable: React.FC<TableProps> = ({ data, columns, onRowClick }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} onClick={() => onRowClick(item)} className="cursor-pointer hover:bg-gray-100">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default DynamicTable;
