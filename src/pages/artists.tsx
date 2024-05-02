import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; 
import DynamicTable from '../components/dynamicTable';

const MyPage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "artists"));
            const dataList = querySnapshot.docs.map(doc => ({
                id: doc.id, // Ajoutez l'ID si nécessaire
                ...doc.data()
            }));
            setData(dataList);
        };

        fetchData();
    }, []);

    // Définissez les colonnes selon les clés de vos documents Firestore
    const columns = ["Nom", "Courriel", "Catégorie", "Nombre ventes", "Revenu généré"];

    return <DynamicTable columns={columns} data={data} />;
};

export default MyPage;
