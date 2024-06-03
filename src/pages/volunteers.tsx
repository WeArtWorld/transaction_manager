import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddVolunteerPopup from '../components/addVolunteersPopUp';
import DynamicTable from '../components/dynamicTable';
import { Column } from 'react-table';
import Modal from 'react-modal';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import withAuth from '../components/withAuth';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  total_revenue: number;
  owed_amount: number;
  item_sold: number;
}

interface VolunteerFormValues {
  name: string;
  email: string;
}

const VolunteersPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isAddVolunteerPopupOpen, setAddVolunteerPopupOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isResetOwedAmountModalOpen, setResetOwedAmountModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get('/api/volunteers');
        setVolunteers(response.data);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };

    fetchVolunteers();
  }, []);

  const handleAddVolunteer = async (volunteer: VolunteerFormValues) => {
    try {
      const newVolunteer = { ...volunteer, owed_amount: 0 } as Volunteer;
      const response = await axios.post('/api/volunteers', newVolunteer);
      setVolunteers([...volunteers, response.data]);
      setAddVolunteerPopupOpen(false);
    } catch (error) {
      console.error('Error adding volunteer:', error);
    }
  };

  const handleEditClick = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setEditModalOpen(true);
  };

  const handleUpdateVolunteer = async (updatedVolunteer: Volunteer) => {
    const { id, ...updateData } = updatedVolunteer;
    try {
      await axios.patch(`/api/volunteers/${id}`, updateData);
      setVolunteers(volunteers.map(v => (v.id === id ? { ...v, ...updateData } : v)));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update volunteer', error);
    }
  };

  const handleDeleteClick = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedVolunteer) {
      try {
        await axios.delete(`/api/volunteers/${selectedVolunteer.id}`);
        setVolunteers(volunteers.filter(volunteer => volunteer.id !== selectedVolunteer.id));
        setDeleteModalOpen(false);
        setSelectedVolunteer(null);
      } catch (error) {
        console.error('Error deleting volunteer:', error);
      }
    }
  };

  const handleResetOwedAmountClick = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setResetOwedAmountModalOpen(true);
  };

  const handleResetOwedAmount = async () => {
    if (selectedVolunteer) {
      try {
        const updatedVolunteer = { ...selectedVolunteer, owed_amount: 0 };
        await axios.patch(`/api/volunteers/${selectedVolunteer.id}`, updatedVolunteer);
        setVolunteers(volunteers.map(v => (v.id === selectedVolunteer.id ? updatedVolunteer : v)));
        setResetOwedAmountModalOpen(false);
        setSelectedVolunteer(null);
      } catch (error) {
        console.error('Failed to reset owed amount', error);
      }
    }
  };

  const columns: Column<Volunteer>[] = React.useMemo(() => [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Email',
      accessor: 'email',
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

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Volunteer>();

  const onSubmit = (data: Volunteer) => {
    handleUpdateVolunteer(data);
    reset();
  };

  return (
    <div className="flex flex-col items-center pt-20 px-4 py-6">
      <div className='w-full max-w-3xl'>
        <DynamicTable
          columns={columns}
          data={volunteers.filter(volunteer => (volunteer.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()))}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          addButtonText="Add a volunteer"
          onAdd={() => setAddVolunteerPopupOpen(true)}
        />
      </div>
      <AddVolunteerPopup isOpen={isAddVolunteerPopupOpen} onClose={() => setAddVolunteerPopupOpen(false)} onAddVolunteer={handleAddVolunteer} />
      {isDeleteModalOpen && selectedVolunteer && (
        <Modal
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setDeleteModalOpen(false)}
          contentLabel="Delete Confirmation"
          className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-25"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-auto">
            <h2 className="text-lg font-bold text-black">Confirm Delete</h2>
            {selectedVolunteer && (
              <p className="mt-4 text-gray-700">
                Are you sure you want to delete the volunteer {selectedVolunteer.name}?
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
      {isResetOwedAmountModalOpen && selectedVolunteer && (
        <Modal
          isOpen={isResetOwedAmountModalOpen}
          onRequestClose={() => setResetOwedAmountModalOpen(false)}
          contentLabel="Reset Owed Amount Confirmation"
          className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-25"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-auto">
            <h2 className="text-lg font-bold text-black">Confirm Reset Owed Amount</h2>
            {selectedVolunteer && (
              <p className="mt-4 text-gray-700">
                Êtes-vous sûr de vouloir réinitialiser le montant dû de ce bénévole?
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
      {isEditModalOpen && selectedVolunteer && (
        <Dialog
          open={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Panel className="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow">
              <Dialog.Title className="text-black font-bold">Edit Details</Dialog.Title>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                <input type="hidden" {...register("id")} value={selectedVolunteer.id} />
                <label className="block">
                  <span className="text-gray-700">Name:</span>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    defaultValue={selectedVolunteer.name}
                    className="mt-1 block w-full p-2 border text-black border-gray-300 rounded shadow-sm"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </label>
                <label className="block">
                  <span className="text-gray-700">Email:</span>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    defaultValue={selectedVolunteer.email}
                    className="mt-1 block w-full p-2 border text-black border-gray-300 rounded shadow-sm"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </label>
                <label className="block">
                  <span className="text-gray-700">Owed Amount:</span>
                  <input
                    type="number"
                    {...register('owed_amount', { required: 'Owed Amount is required', valueAsNumber: true })}
                    defaultValue={selectedVolunteer.owed_amount}
                    className="mt-1 block w-full p-2 border text-black border-gray-300 rounded shadow-sm"
                  />
                  {errors.owed_amount && <p className="text-red-500 text-xs mt-1">{errors.owed_amount.message}</p>}
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

//export default VolunteersPage;
export default withAuth(VolunteersPage);
