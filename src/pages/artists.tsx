import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddArtistPopup from '../components/addArtistPopUp';
import DynamicTable from '../components/dynamicTable';
import { Column } from 'react-table';
import Modal from 'react-modal';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';

interface Artist {
  id: string;
  name: string;
  email: string;
  categorie: string;
  total_revenue: number;
  owed_amount: number;
  item_sold: number;
}

interface ArtistFormValues {
  name: string;
  email: string;
  categorie: string;  
}

const ArtistsPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isAddArtistPopupOpen, setAddArtistPopupOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isResetOwedAmountModalOpen, setResetOwedAmountModalOpen] = useState(false);
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

  const handleAddArtist = async (artist: ArtistFormValues) => {
    try {
      const newArtist = { ...artist, total_revenue: 0, owed_amount: 0, item_sold: 0 } as Artist;
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

  const handleResetOwedAmountClick = (artist: Artist) => {
    setSelectedArtist(artist);
    setResetOwedAmountModalOpen(true);
  };

  const handleResetOwedAmount = async () => {
    if (selectedArtist) {
      try {
        const updatedArtist = { ...selectedArtist, owed_amount: 0 };
        await axios.patch(`/api/artists/${selectedArtist.id}`, updatedArtist);
        setArtists(artists.map(a => (a.id === selectedArtist.id ? updatedArtist : a)));
        setResetOwedAmountModalOpen(false);
        setSelectedArtist(null);
      } catch (error) {
        console.error('Failed to reset owed amount', error);
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
          <button onClick={() => handleResetOwedAmountClick(row.original)}>
            <i className="fas fa-money-bill pl-5" style={{ color: 'green', cursor: 'pointer' }}></i>
          </button>
        </>
      ),
    },
  ], []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Artist>();

  const onSubmit = (data: Artist) => {
    handleUpdateArtist(data);
    reset();
  };

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
          className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-25"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-auto">
            <h2 className="text-lg font-bold text-black">Confirm Delete</h2>
            {selectedArtist && (
              <p className="mt-4 text-gray-700">
                Are you sure you want to delete the artist {selectedArtist.name}?
              </p>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isResetOwedAmountModalOpen && selectedArtist && (
        <Modal
          isOpen={isResetOwedAmountModalOpen}
          onRequestClose={() => setResetOwedAmountModalOpen(false)}
          contentLabel="Reset Owed Amount Confirmation"
          className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-25"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-auto">
            <h2 className="text-lg font-bold text-black">Confirm Reset Owed Amount</h2>
            {selectedArtist && (
              <p className="mt-4 text-gray-700">
                Êtes-vous sûr de vouloir réinitialiser le montant dû de {selectedArtist.name}?
              </p>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleResetOwedAmount}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
              >
                Reset
              </button>
              <button
                onClick={() => setResetOwedAmountModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isEditModalOpen && selectedArtist && (
        <Dialog
          open={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Panel className="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow">
              <Dialog.Title className="text-black font-bold">Edit Details</Dialog.Title>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                <input type="hidden" {...register("id")} value={selectedArtist.id} />
                <label className="block">
                  <span className="text-gray-700">Name:</span>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    defaultValue={selectedArtist.name}
                    className="mt-1 block w-full p-2 border text-black border-gray-300 rounded shadow-sm"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </label>
                <label className="block">
                  <span className="text-gray-700">Email:</span>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    defaultValue={selectedArtist.email}
                    className="mt-1 block w-full p-2 border text-black border-gray-300 rounded shadow-sm"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </label>
                <label className="block">
                  <span className="text-gray-700">Categorie:</span>
                  <input
                    {...register('categorie', { required: 'Category is required' })}
                    defaultValue={selectedArtist.categorie}
                    className="mt-1 block w-full p-2 border text-black border-gray-300 rounded shadow-sm"
                  />
                  {errors.categorie && <p className="text-red-500 text-xs mt-1">{errors.categorie.message}</p>}
                </label>
                <label className="block">
                  <span className="text-gray-700">Total Revenue:</span>
                  <input
                    type="number"
                    {...register('total_revenue', { required: 'Total Revenue is required', valueAsNumber: true })}
                    defaultValue={selectedArtist.total_revenue}
                    className="mt-1 block w-full p-2 border text-black border-gray-300 rounded shadow-sm"
                  />
                  {errors.total_revenue && <p className="text-red-500 text-xs mt-1">{errors.total_revenue.message}</p>}
                </label>
                <label className="block">
                  <span className="text-gray-700">Owed Amount:</span>
                  <input
                    type="number"
                    {...register('owed_amount', { required: 'Owed Amount is required', valueAsNumber: true })}
                    defaultValue={selectedArtist.owed_amount}
                    className="mt-1 block w-full p-2 border text-black border-gray-300 rounded shadow-sm"
                  />
                  {errors.owed_amount && <p className="text-red-500 text-xs mt-1">{errors.owed_amount.message}</p>}
                </label>
                <label className="block">
                  <span className="text-gray-700">Item Sold:</span>
                  <input
                    type="number"
                    {...register('item_sold', { required: 'Item Sold is required', valueAsNumber: true })}
                    defaultValue={selectedArtist.item_sold}
                    className="mt-1 block w-full p-2 border text-black border-gray-300 rounded shadow-sm"
                  />
                  {errors.item_sold && <p className="text-red-500 text-xs mt-1">{errors.item_sold.message}</p>}
                </label>
                <div className="flex justify-end mt-4">
                  <button type="button" onClick={() => setEditModalOpen(false)} className="mr-2 px-4 py-2 text-gray-700 border rounded">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
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
