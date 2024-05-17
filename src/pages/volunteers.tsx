import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddVolunteerPopup from '../components/addVolunteersPopUp';
import DynamicTable from '../components/dynamicTable';
import { Column } from 'react-table';
import Modal from 'react-modal';
import { Dialog } from '@headlessui/react';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  total_revenue: number;
  owed_amount: number;
  item_sold: number;
}

const VolunteersPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isAddVolunteerPopupOpen, setAddVolunteerPopupOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
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

  const handleAddVolunteer = async (volunteer: Omit<Volunteer, 'id' | 'total_revenue' | 'owed_amount' | 'item_sold'>) => {
    try {
      const newVolunteer = { ...volunteer, total_revenue: 0, owed_amount: 0, item_sold: 0 };
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
        </>
      ),
    },
  ], []);

  return (
    <div className="container mx-auto pt-20 px-4 py-6">
      <DynamicTable
        columns={columns}
        data={volunteers.filter(volunteer => volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) || volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()))}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => setAddVolunteerPopupOpen(true)}
      />
      <AddVolunteerPopup isOpen={isAddVolunteerPopupOpen} onClose={() => setAddVolunteerPopupOpen(false)} onAddVolunteer={handleAddVolunteer} />
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setDeleteModalOpen(false)}
          contentLabel="Delete Confirmation"
        >
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-bold">Confirm Delete</h2>
            {selectedVolunteer && (
              <p>
                Are you sure you want to delete the volunteer {selectedVolunteer.name}?
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
                {selectedVolunteer && Object.keys(selectedVolunteer).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      value={(selectedVolunteer as any)[key]}
                      onChange={(e) => {
                        const updated = { ...selectedVolunteer, [key]: e.target.value };
                        setSelectedVolunteer(updated);
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
                  <button onClick={() => handleUpdateVolunteer(selectedVolunteer!)} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
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

export default VolunteersPage;
