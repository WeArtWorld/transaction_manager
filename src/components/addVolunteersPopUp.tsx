import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';

interface VolunteerFormValues {
  name: string;
  email: string;
}

interface AddVolunteerPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddVolunteerPopup: React.FC<AddVolunteerPopupProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset } = useForm<VolunteerFormValues>();

  const onSubmit = async (data: VolunteerFormValues) => {
    const postData = {
      name: data.name,
      email: data.email,
      item_sold: 0,
      owed_amount: 0,
      total_revenue: 0
    };
    
    try {
      const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Volunteers.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to post new volunteer');
      }
      
      reset(); 
      onClose(); 
    } catch (error) {
      console.error('Error when adding volunteer:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-lg shadow">
          <Dialog.Title className="text-lg font-bold text-black">Add a Volunteer</Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Name:</span>
                <input type="text" {...register('name')} className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" required />
              </label>
              <label className="block">
                <span className="text-gray-700">Email:</span>
                <input type="email" {...register('email')} className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" required />
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

export default AddVolunteerPopup;
