import React, { useEffect, useState } from 'react';
import DynamicTable from '../components/dynamicTable';
import AddArtistPopup from '../components/addArtistPopUp';
import { Column } from 'react-table';

interface Artist {
  name: string;
  email: string;
  category: string;
  item_sold: number;
  total_revenue: number;
}

const ArtistPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Artists.json');
        const data = await response.json();
        const loadedArtists = Object.values(data).map((item: any) => ({
          name: item.nom,
          email: item.email,
          category: item.categorie,
          item_sold: item.totalVente,
          total_revenue: item.montantDu,
        }));
        setArtists(loadedArtists);
      } catch (error) {
        console.error('Erreur lors de la récupération des artistes:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddArtistClick = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const columns: Column<Artist>[] = React.useMemo(() => [
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Email',
      accessor: 'email'
    },
    {
      Header: 'Category',
      accessor: 'category'
    },
    {
      Header: 'Total vente',
      accessor: 'item_sold'
    },
    {
      Header: 'Revenu Généré',
      accessor: 'total_revenue'
    },
  ], []);

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
          <button className="p-2 border border-gray-300 rounded text-black bg-blue-500 hover:bg-blue-600">
            Search
          </button>
        </div>
        <button onClick={handleAddArtistClick} className="p-2 border border-gray-300 rounded text-black bg-green-500 hover:bg-green-600">
          Add an Artist
        </button>
      </div>
      <DynamicTable columns={columns} data={artists.filter(artist => artist.name.toLowerCase().includes(searchTerm.toLowerCase()))} />
      <AddArtistPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </div>
  );
};

export default ArtistPage;