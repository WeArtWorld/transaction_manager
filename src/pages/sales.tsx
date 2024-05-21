import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddSalePopup from '../components/addSalePopup';
import DynamicTable from '../components/dynamicTable';
import { Column } from 'react-table';
import Modal from 'react-modal';
import { Dialog } from '@headlessui/react';

interface Sale {
  id: string;
  article: string;
  comment: string;
  completed_payment: boolean;
  date: string;
  payment_method: string;
  pick_up: boolean;
  price: string;
  volunteer_id: string;
  artist_id: string;
}

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isAddSalePopupOpen, setAddSalePopupOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [volunteers, setVolunteers] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('/api/sales');
        setSales(response.data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    const fetchVolunteers = async () => {
      try {
        const response = await axios.get('/api/volunteers');
        const volunteerMap = response.data.reduce((acc: { [key: string]: string }, vol: { id: string, name: string }) => {
          acc[vol.id] = vol.name;
          return acc;
        }, {});
        setVolunteers(volunteerMap);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };

    fetchSales();
    fetchVolunteers();
  }, []);

  const handleAddSale = async (sale: Omit<Sale, 'id' | 'date'>) => {
    const postData = {
      ...sale,
      date: new Date().toISOString(), // Set current date and time
    };

    try {
      // Add the sale
      const response = await axios.post('/api/sales', postData);
      setSales([...sales, { ...postData, id: response.data.id }]);
      setAddSalePopupOpen(false); // Close the modal
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  };

  const handleEditClick = (sale: Sale) => {
    setSelectedSale(sale);
    setEditModalOpen(true);
  };

  const handleUpdateSale = async (updatedSale: Sale) => {
    const { id, ...updateData } = updatedSale;
    try {
      await axios.patch(`/api/sales/${id}`, updateData);
      setSales(sales.map(s => (s.id === id ? { ...s, ...updateData } : s)));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update sale', error);
    }
  };

  const handleDeleteClick = (sale: Sale) => {
    setSelectedSale(sale);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedSale) {
      try {
        await axios.delete(`/api/sales/${selectedSale.id}`);
        setSales(sales.filter(sale => sale.id !== selectedSale.id));
        setDeleteModalOpen(false);
        setSelectedSale(null);
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

  const columns: Column<Sale>[] = React.useMemo(() => [
    {
      Header: 'Article',
      accessor: 'article',
    },
    {
      Header: 'Comment',
      accessor: 'comment',
    },
    {
      Header: 'Date',
      accessor: 'date',
    },
    {
      Header: 'Payment Method',
      accessor: 'payment_method',
    },
    {
      Header: 'Pick Up',
      accessor: 'pick_up',
    },
    {
      Header: 'Price',
      accessor: 'price',
    },
    {
      Header: 'Volunteer Name',
      accessor: 'volunteer_id',
      Cell: ({ value }: any) => volunteers[value] || 'Unknown'
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
  ], [volunteers]);

  return (
    <div className="container pt-20 mx-auto px-4 py-6">
      <DynamicTable
        columns={columns}
        data={sales.filter(sale => sale.article.toLowerCase().includes(searchTerm.toLowerCase()) || sale.volunteer_id.toLowerCase().includes(searchTerm.toLowerCase()))}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => setAddSalePopupOpen(true)}
      />
      <AddSalePopup isOpen={isAddSalePopupOpen} onClose={() => setAddSalePopupOpen(false)} onAddSale={handleAddSale} />
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setDeleteModalOpen(false)}
          contentLabel="Delete Confirmation"
        >
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-bold">Confirm Delete</h2>
            {selectedSale && (
              <p>
                Are you sure you want to delete the sale of {selectedSale.article} by {selectedSale.volunteer_id}?
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
                {selectedSale && Object.keys(selectedSale).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      value={(selectedSale as any)[key]}
                      onChange={(e) => {
                        const updated = { ...selectedSale, [key]: e.target.value };
                        setSelectedSale(updated);
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
                  <button onClick={() => handleUpdateSale(selectedSale!)} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
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

export default SalesPage;

