import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface SaleFormValues {
  article: string;
  comment: string;
  payment_method: string;
  pick_up: boolean;
  price: string;
  volunteer_name: string;
  artist_id: string;
  completed_payment: boolean;
}

interface AddSalePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSale: (sale: SaleFormValues) => void;
}

interface Artist {
  id: string;
  name: string;
}

interface Volunteer {
  id: string;
  name: string;
}

const AddSalePopup: React.FC<AddSalePopupProps> = ({ isOpen, onClose, onAddSale }) => {
  const { register, handleSubmit, reset } = useForm<SaleFormValues>();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get('/api/artists');
        setArtists(response.data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    const fetchVolunteers = async () => {
      try {
        const response = await axios.get('/api/volunteers');
        setVolunteers(response.data);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };

    fetchArtists();
    fetchVolunteers();
  }, []);

  const onSubmit = async (data: SaleFormValues) => {
    try {
      onAddSale(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error when adding sale:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-lg shadow">
          <Dialog.Title className="text-lg font-bold text-black">Add a Sale</Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Article:</span>
                <input
                  type="text"
                  {...register('article', { required: true })}
                  className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Comment:</span>
                <input
                  type="text"
                  {...register('comment')}
                  className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Price:</span>
                <input
                  type="text"
                  {...register('price', { required: true })}
                  className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Payment Method:</span>
                <select
                  {...register('payment_method', { required: true })}
                  className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  <option value="cash">Cash</option>
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">Artist:</span>
                <select
                  {...register('artist_id', { required: true })}
                  className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">Volunteer:</span>
                <select
                  {...register('volunteer_name', { required: true })}
                  className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  {volunteers.map((volunteer) => (
                    <option key={volunteer.id} value={volunteer.name}>
                      {volunteer.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">Completed Payment:</span>
                <input
                  type="checkbox"
                  {...register('completed_payment')}
                  className="mt-1 block text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Pick Up:</span>
                <input
                  type="checkbox"
                  {...register('pick_up')}
                  className="mt-1 block text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-gray-700 border rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                Add
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddSalePopup;
