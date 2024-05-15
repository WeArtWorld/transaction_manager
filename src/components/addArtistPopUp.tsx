import React, { useState } from 'react';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [categorie, setCategorie] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddArtist({ name, email, categorie });
    setName('');
    setEmail('');
    setCategorie('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-lg shadow">
          <Dialog.Title className="text-lg font-bold text-black">Add an Artist</Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Name:</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Email:</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Categorie:</span>
                <input
                  type="text"
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  required
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

export default AddArtistPopup;
