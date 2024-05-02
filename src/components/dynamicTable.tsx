type TableProps = {
    columns: Array<string>;
    data: Array<{ [key: string]: string | number }>;
};

const DynamicTable: React.FC<TableProps> = ({ columns, data }) => {
    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} scope="col" className="py-3 px-6">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="py-4 px-6">
                                    {row[column]}
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