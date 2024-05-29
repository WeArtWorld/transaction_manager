import React from 'react';
import { useTable, Column } from 'react-table';
import Tooltip from '../components/toolTip';

interface DynamicTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  searchTerm: string;
  addButtonText: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onAdd: () => void;
}

const DynamicTable = <T extends object>({
  columns,
  data,
  searchTerm,
  addButtonText,
  setSearchTerm,
  onAdd,
}: DynamicTableProps<T>) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<T>({ columns, data });

  const formatDateTime = (value: string) => {
    const date = new Date(value);
    return `${date.getFullYear()} ${String(date.getMonth() + 1).padStart(2, '0')} ${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search by name"
            className="text-black p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="p-2 border border-gray-300 rounded text-black bg-blue-500 hover:bg-blue-600">
            Search
          </button>
        </div>
        <button onClick={onAdd} className="p-2 border border-gray-300 rounded text-black bg-green-500 hover:bg-green-600">
          {addButtonText}
        </button>
      </div>
      <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  key={column.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map(cell => {
                  const cellContent = cell.column.id === 'date' ? formatDateTime(cell.value) : cell.render('Cell');
                  const comment = (row.original as any).comment;
                  return (
                    <td {...cell.getCellProps()} key={cell.column.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {comment ? (
                        <Tooltip text={comment}>
                          {cellContent}
                        </Tooltip>
                      ) : (
                        cellContent
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
