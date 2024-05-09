import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';

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
}

interface Artist {
  id: string;
  name: string;
}

interface Volunteer {
  name: string;
}

const AddSalePopup: React.FC<AddSalePopupProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, setValue } = useForm<SaleFormValues>();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Artists.json');
      const data = await response.json();
      const loadedArtists = Object.entries(data).map(([key, value]: [string, any]) => ({
        id: key,
        name: value.name
      }));
      setArtists(loadedArtists);
    };

    const fetchVolunteers = async () => {
      const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Volunteers.json');
      const data = await response.json();
      const loadedVolunteers = Object.entries(data).map(([key, value]: [string, any]) => ({
        name: value.name
      }));
      setVolunteers(loadedVolunteers);
    };

    fetchArtists();
    fetchVolunteers();
  }, []);

  const onSubmit = async (data: SaleFormValues) => {
    const postData = {
      ...data,
      date: new Date().toISOString(), // Set current date and time
    };
    
    try {
      const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Sales.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to post new sale');
      }
      
      reset();  // Reset form fields after successful posting
      onClose();  // Close the modal
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
                <input type="text" {...register('article', { required: true })} className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              </label>
              <label className="block">
                <span className="text-gray-700">Comment:</span>
                <input type="text" {...register('comment')} className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              </label>
              <label className="block">
                <span className="text-gray-700">Price:</span>
                <input type="text" {...register('price', { required: true })} className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              </label>
              <label className="block">
                <span className="text-gray-700">Payment Method:</span>
                <select {...register('payment_method', { required: true })} className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50">
                  <option value="cash">Cash</option>
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">Artist:</span>
                <select {...register('artist_id', { required: true })} className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50">
                  {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>{artist.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">Volunteer:</span>
                <select {...register('volunteer_name', { required: true })} className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50">
                  {volunteers.map((volunteer, index) => (
                    <option key={index} value={volunteer.name}>{volunteer.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">Completed Payment:</span>
                <input type="checkbox" {...register('completed_payment')} className="mt-1 block text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              </label>
              <label className="block">
                <span className="text-gray-700">Pick Up:</span>
                <input type="checkbox" {...register('pick_up')} className="mt-1 block text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
              </label>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-gray-700 border rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Add</button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddSalePopup;