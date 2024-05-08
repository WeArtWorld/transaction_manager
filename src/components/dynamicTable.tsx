import React, { useState } from 'react';
import { useTable, Column, Row } from 'react-table';
import Modal from 'react-modal';

Modal.setAppElement('#__next');

interface TableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  onSave: (data: T) => void; 
}

const DynamicTable = <T extends object>({ columns, data, onSave}: TableProps<T>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<T>({ columns, data });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editableRow, setEditableRow] = useState<T | null>(null);

  const handleRowClick = (row: Row<T>) => {
    setEditableRow({ ...row.original });
    setModalIsOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof T) => {
    if (editableRow) {
      setEditableRow({ ...editableRow, [field]: e.target.value });
    }
  };

  const handleSave = () => {
    if (editableRow) {
      onSave(editableRow);
      setModalIsOpen(false);
    }
  };

  return (
    <>
      <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {headerGroups.map(headerGroup => {
            const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...headerGroupProps}>
                {headerGroup.headers.map(column => {
                  const { key, ...headerProps } = column.getHeaderProps();
                  return (
                    <th key={key} {...headerProps} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {column.render('Header')}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
          {rows.map(row => {
            prepareRow(row);
            const { key, ...rowProps } = row.getRowProps();
            return (
              <tr key={key} {...rowProps} onClick={() => handleRowClick(row)} className=" cursor-pointer hover:bg-gray-100">
                {row.cells.map(cell => {
                  const { key, ...cellProps } = cell.getCellProps();
                  return (
                    <td key={key} {...cellProps} className="px-6 py-4 whitespace-nowrap text-black">
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Row Details"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-bold">Edit Details</h2>
          {editableRow && Object.keys(editableRow).map((key) => (
            <input
            key={key}
            type="text"
            value={(editableRow as any)[key]}
            onChange={(e) => handleChange(e, key as keyof T)}
            className="text-black p-2 border border-gray-300 rounded"
            readOnly={key === 'key'} 
            style={key === 'key' ? { backgroundColor: '#647689', color: '#495057' } : {}}
          />
          ))}
          <button onClick={handleSave} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </Modal>
    </>
  );
};

export default DynamicTable;