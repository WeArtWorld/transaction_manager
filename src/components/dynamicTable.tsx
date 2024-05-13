import React, { useState } from "react";
import { useTable, Column, Row } from "react-table";
import { Dialog } from "@headlessui/react";

interface TableProps<T extends object> {
    columns: Column<T>[];
    data: T[];
    onSave: (data: T) => void;
}

const DynamicTable = <T extends object>({
    columns,
    data,
    onSave,
}: TableProps<T>) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable<T>({ columns, data });

    const [isOpen, setIsOpen] = useState(false);
    const [editableRow, setEditableRow] = useState<T | null>(null);

    const handleRowClick = (row: Row<T>) => {
        setEditableRow({ ...row.original });
        //setIsOpen(true);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof T
    ) => {
        if (editableRow) {
            setEditableRow({ ...editableRow, [field]: e.target.value });
        }
    };

    const handleSave = () => {
        if (editableRow) {
            onSave(editableRow);
            setIsOpen(false);
        }
    };

    return (
        <>
            <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200"
            >
                <thead className="bg-gray-50">
                    {headerGroups.map((headerGroup) => {
                        const { key, ...headerGroupProps } =
                            headerGroup.getHeaderGroupProps();
                        return (
                            <tr key={key} {...headerGroupProps}>
                                {headerGroup.headers.map((column) => {
                                    const { key, ...headerProps } =
                                        column.getHeaderProps();
                                    return (
                                        <th
                                            key={key}
                                            {...headerProps}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {column.render("Header")}
                                        </th>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </thead>
                <tbody
                    {...getTableBodyProps()}
                    className="bg-white divide-y divide-gray-200"
                >
                    {rows.map((row) => {
                        prepareRow(row);
                        const { key, ...rowProps } = row.getRowProps();
                        return (
                            <tr
                                key={key}
                                {...rowProps}
                                onClick={() => handleRowClick(row)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                {row.cells.map((cell) => {
                                    const { key, ...cellProps } =
                                        cell.getCellProps();
                                    return (
                                        <td
                                            key={key}
                                            {...cellProps}
                                            className="px-6 py-4 whitespace-nowrap text-black"
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            
        </>
    );
};

export default DynamicTable;
