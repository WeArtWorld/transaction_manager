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
  volunteer_id: string;
  artist_id: string;
  completed_payment: boolean;
  item: string;
  amount: string;
}

interface Sale {
  id: string;
  item: string;
  amount: string;
  date: string;
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
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SaleFormValues>();
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
        <Dialog.Panel className="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow">
          <Dialog.Title className="text-lg font-bold text-black">Add Sale</Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4">
              <label className="block">
                <span className="text-gray-700">Article:</span>
                <input
                  type="text"
                  {...register('article', { required: true })}
                  className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
                {errors.article && <p className="text-red-500 text-xs mt-1">{errors.article.message}</p>}
              </label>
              <label className="block">
                <span className="text-gray-700">Comment:</span>
                <input
                  type="text"
                  {...register('comment')}
                  className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Payment Method:</span>
                <select
                  {...register('payment_method', { required: true })}
                  className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="paypal">PayPal</option>
                </select>
                {errors.payment_method && <p className="text-red-500 text-xs mt-1">{errors.payment_method.message}</p>}
              </label>
              <label className="block">
                <span className="text-gray-700">Price:</span>
                <input
                  type="number"
                  {...register('price', { required: 'Price is required', valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </label>
              <label className="block">
                <span className="text-gray-700">Artist:</span>
                <select
                  {...register('artist_id', { required: 'Artist is required' })}
                  className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
                {errors.artist_id && <p className="text-red-500 text-xs mt-1">{errors.artist_id.message}</p>}
              </label>
              <label className="block">
                <span className="text-gray-700">Volunteer:</span>
                <select
                  {...register('volunteer_id', { required: 'Volunteer is required' })}
                  className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  {volunteers.map((volunteer) => (
                    <option key={volunteer.id} value={volunteer.id}>
                      {volunteer.name}
                    </option>
                  ))}
                </select>
                {errors.volunteer_id && <p className="text-red-500 text-xs mt-1">{errors.volunteer_id.message}</p>}
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
