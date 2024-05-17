import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddArtistPopup from '../components/addArtistPopUp';
import DynamicTable from '../components/dynamicTable';
import { Column } from 'react-table';
import Modal from 'react-modal';
import { Dialog } from '@headlessui/react';

interface Artist {
  id: string;
  name: string;
  email: string;
  categorie: string;
  total_revenue: number;
  owed_amount: number;
  item_sold: number;
}

const ArtistsPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isAddArtistPopupOpen, setAddArtistPopupOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get('/api/artists');
        setArtists(response.data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  const handleAddArtist = async (artist: Omit<Artist, 'id' | 'total_revenue' | 'owed_amount' | 'item_sold'>) => {
    try {
      const newArtist = { ...artist, total_revenue: 0, owed_amount: 0, item_sold: 0 };
      const response = await axios.post('/api/artists', newArtist);
      setArtists([...artists, response.data]);
      setAddArtistPopupOpen(false);
    } catch (error) {
      console.error('Error adding artist:', error);
    }
  };

  const handleEditClick = (artist: Artist) => {
    setSelectedArtist(artist);
    setEditModalOpen(true);
  };

  const handleUpdateArtist = async (updatedArtist: Artist) => {
    const { id, ...updateData } = updatedArtist;
    try {
      await axios.patch(`/api/artists/${id}`, updateData);
      setArtists(artists.map(a => (a.id === id ? { ...a, ...updateData } : a)));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update artist', error);
    }
  };

  const handleDeleteClick = (artist: Artist) => {
    setSelectedArtist(artist);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedArtist) {
      try {
        await axios.delete(`/api/artists/${selectedArtist.id}`);
        setArtists(artists.filter(artist => artist.id !== selectedArtist.id));
        setDeleteModalOpen(false);
        setSelectedArtist(null);
      } catch (error) {
        console.error('Error deleting artist:', error);
      }
    }
  };

  const columns: Column<Artist>[] = React.useMemo(() => [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Categorie',
      accessor: 'categorie',
    },
    {
      Header: 'Total Revenue',
      accessor: 'total_revenue',
    },
    {
      Header: 'Owed Amount',
      accessor: 'owed_amount',
    },
    {
      Header: 'Item Sold',
      accessor: 'item_sold',
    },
    {
      Header: 'Actions',
      Cell: ({ row }: any) => (
        <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
          <button onClick={() => handleEditClick(row.original)}>
            <i className="fas fa-edit pr-5" style={{ color: 'blue', cursor: 'pointer' }}></i>
          </button>
          <button onClick={() => handleDeleteClick(row.original)}>
            <i className="fas fa-trash" style={{ color: 'red', cursor: 'pointer' }}></i>
          </button>
        </>
      ),
    },
  ], []);

  return (
    <div className="container mx-auto pt-20 px-4 py-6">
      <DynamicTable
      
        columns={columns}
        data={artists.filter(artist => artist.name.toLowerCase().includes(searchTerm.toLowerCase()) || artist.email.toLowerCase().includes(searchTerm.toLowerCase()))}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => setAddArtistPopupOpen(true)}
      />
      <AddArtistPopup isOpen={isAddArtistPopupOpen} onClose={() => setAddArtistPopupOpen(false)} onAddArtist={handleAddArtist} />
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setDeleteModalOpen(false)}
          contentLabel="Delete Confirmation"
        >
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-bold">Confirm Delete</h2>
            {selectedArtist && (
              <p>
                Are you sure you want to delete the artist {selectedArtist.name}?
              </p>
            )}
            <div>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isEditModalOpen && (
        <Dialog
          open={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-lg shadow">
              <Dialog.Title className="text-lg font-bold">Edit Details</Dialog.Title>
              <form className="flex flex-col space-y-4">
                {selectedArtist && Object.keys(selectedArtist).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      value={(selectedArtist as any)[key]}
                      onChange={(e) => {
                        const updated = { ...selectedArtist, [key]: e.target.value };
                        setSelectedArtist(updated);
                      }}
                      className="mt-1 block w-full p-2 border text-black border-gray-300 rounded shadow-sm sm:text-sm"
                      readOnly={key === 'id'}
                      style={key === 'id' ? { backgroundColor: '#647689', color: '#495057' } : {}}
                    />
                  </div>
                ))}
                <div className="flex justify-end mt-4">
                  <button onClick={() => setEditModalOpen(false)} className="mr-2 px-4 py-2 text-gray-700 border rounded">
                    Cancel
                  </button>
                  <button onClick={() => handleUpdateArtist(selectedArtist!)} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ArtistsPage;
