import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';

interface ArtistFormValues {
  nom: string;
  email: string;
  categorie: string;
}

interface AddArtistPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddArtistPopup: React.FC<AddArtistPopupProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset } = useForm<ArtistFormValues>();

  const onSubmit = (data: ArtistFormValues) => {
    console.log(data);  // Vous pourriez ici envoyer les données à un serveur
    reset();  // Réinitialiser le formulaire après l'envoi
    onClose();  // Fermer le popup
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-lg shadow">
          <Dialog.Title className="text-lg font-bold">Ajouter un artiste</Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Nom artiste :</span>
                <input type="text" {...register('nom')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" required />
              </label>
              <label className="block">
                <span className="text-gray-700">Email :</span>
                <input type="email" {...register('email')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" required />
              </label>
              <label className="block">
                <span className="text-gray-700">Catégorie :</span>
                <select {...register('categorie')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" required>
                  <option value="peinture">Peinture</option>
                  <option value="sculpture">Sculpture</option>
                  <option value="photographie">Photographie</option>
                </select>
              </label>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-gray-700 border rounded">Annuler</button>
              <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Ajouter</button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddArtistPopup;