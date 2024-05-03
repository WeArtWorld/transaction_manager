import React, { useEffect, useState } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import DynamicTable from '../components/dynamicTable';
import { Column } from 'react-table';

interface Artist {
  name: string;
  email: string;
  category: string;
  salesCount: number;
  revenue: number;
}

const ArtistPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchArtists = async () => {
      const artistCollection = collection(db, 'Artists');
      const snapshot = await getDocs(artistCollection);
      const artistsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Artist }));
      setArtists(artistsData);
    };

    fetchArtists();
    console.log(artists);
  }, []);

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
      Header: 'Sales Count',
      accessor: 'salesCount'
    },
    {
      Header: 'Revenue',
      accessor: 'revenue'
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
          <button className="p-2 border border-gray-300 rounded text-white bg-blue-500 hover:bg-blue-600">
            Search
          </button>
        </div>
        <button className="p-2 border border-gray-300 rounded text-white bg-green-500 hover:bg-green-600">
          Add an Artist
        </button>
      </div>
      <DynamicTable columns={columns} data={artists.filter(artist => artist.name.toLowerCase().includes(searchTerm.toLowerCase()))} />
    </div>
  );
};

export default ArtistPage;