import React, { useEffect, useState } from 'react';
import DynamicTable from '../components/dynamicTable';
import DetailPopup from '../components/popupInfo';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const SalesPage = () => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [selectedSale, setSelectedSale] = useState<any>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      const salesCollection = collection(db, 'sales');
      const salesSnapshot = await getDocs(salesCollection);
      const salesList = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSalesData(salesList);
      console.log(salesList)
    };

    fetchSalesData();
    console.log(salesData);
  }, []);

  // Define the columns based on your data's keys
  const columns = [
    { key: 'article', label: 'Nom' },
    { key: 'client_email', label: 'Courriel' },
    { key: 'category', label: 'Catégorie' },
    { key: 'sales_count', label: 'Nombre ventes' },
    { key: 'revenue', label: 'Revenu généré' }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Data</h1>
      
      <DynamicTable data={salesData} columns={columns} onRowClick={setSelectedSale} />
      
      {selectedSale && <DetailPopup item={selectedSale} onClose={() => setSelectedSale(null)} />}
    </div>
  );
};

export default SalesPage;