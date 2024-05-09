import React, { useEffect, useState } from "react";
import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import DynamicTable from "../components/dynamicTable";
import { Column } from "react-table";

interface Sale {
    name: string;
    email: string;
    category: string;
    salesCount: number;
    revenue: number;
}

const SalePage: React.FC = () => {
    const [Sales, setSales] = useState<Sale[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const fetchSales = async () => {
            const SaleCollection = collection(db, "Sales");
            const snapshot = await getDocs(SaleCollection);
            const SalesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Sale),
            }));
            setSales(SalesData);
        };

        fetchSales();
    }, []);

    const columns: Column<Sale>[] = React.useMemo(
        () => [
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Category",
                accessor: "category",
            },
            {
                Header: "Nombre vente",
                accessor: "salesCount",
            },
            {
                Header: "Revenu généré",
                accessor: "revenue",
            },
        ],
        []
    );

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="p-2 border border-gray-300 rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="p-2 border border-gray-300 rounded text-white bg-blue-500 hover:bg-blue-600">
                        Search
                    </button>
                </div>
                <button className="p-2 border border-gray-300 rounded text-white bg-green-500 hover:bg-green-600">
                    Add an Sale
                </button>
            </div>
            
        </div>
    );
};

export default SalePage;
