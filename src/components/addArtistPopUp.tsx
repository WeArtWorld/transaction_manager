import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog } from '@headlessui/react';

interface ArtistFormValues {
  name: string;
  email: string;
  categorie: string;
}

interface AddArtistPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddArtist: (artist: ArtistFormValues) => void;
}

const AddArtistPopup: React.FC<AddArtistPopupProps> = ({ isOpen, onClose, onAddArtist }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ArtistFormValues>();

  const onSubmit = (data: ArtistFormValues) => {
    onAddArtist(data);
    reset();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow">
          <Dialog.Title className="text-black font-bold">Add an Artist</Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Name:</span>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </label>
              <label className="block">
                <span className="text-gray-700">Email:</span>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </label>
              <label className="block">
                <span className="text-gray-700">Category:</span>
                <input
                  {...register('categorie', { required: 'Category is required' })}
                  className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
                {errors.categorie && <p className="text-red-500 text-xs mt-1">{errors.categorie.message}</p>}
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

export default AddArtistPopup;
