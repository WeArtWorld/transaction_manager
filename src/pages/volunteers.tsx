import React, { useEffect, useState } from "react";
import DynamicTable from "../components/dynamicTable";
import AddVolunteerPopup from '../components/addVolunteersPopUp';
import { Column } from "react-table";
import Modal from "react-modal";

Modal.setAppElement("#__next");

interface Volunteer {
  key: string;
  name: string;
  email: string;
  item_sold: number;
  owed_amount: number;
  total_revenue: number;
}

const VolunteerPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Volunteers.json');
        const data = await response.json();
        const loadedVolunteers = Object.entries(data).map(([key, item]: [string, any]) => ({
          key: key,
          name: item.name,
          email: item.email,
          item_sold: item.item_sold,
          owed_amount: item.owed_amount,
          total_revenue: item.total_revenue,
        }));
        setVolunteers(loadedVolunteers);
      } catch (error) {
        console.error('Error retrieving volunteers:', error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (volunteerKey: string) => {
    const volunteer = volunteers.find(a => a.key === volunteerKey);
    if (volunteer) {
      setSelectedVolunteer(volunteer);
      setModalIsOpen(true);
    }
  };

  const handleUpdateVolunteer = async (updatedVolunteer: Volunteer) => {
    const { key, ...updateData } = updatedVolunteer;
    try {
      await fetch(`https://transactions-man-default-rtdb.firebaseio.com/Volunteers/${updatedVolunteer.key}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      setVolunteers(volunteers.map(a => a.key === key ? { ...a, ...updateData } : a));
      setModalIsOpen(false);
    } catch (error) {
      console.error('Failed to update volunteer', error);
    }
  };

  const handleAddVolunteerClick = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleDelete = async () => {
    if (selectedVolunteer) {
      try {
        await fetch(
          `https://transactions-man-default-rtdb.firebaseio.com/Volunteers/${selectedVolunteer.key}.json`,
          {
            method: "DELETE",
          }
        );
        setVolunteers(
          volunteers.filter((volunteer) => volunteer.key !== selectedVolunteer.key)
        );
        setModalIsOpen(false);
        setSelectedVolunteer(null);
      } catch (error) {
        console.error("Error deleting volunteer:", error);
      }
    }
  };

  const columns: Column<Volunteer>[] = React.useMemo(() => [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Items Sold",
      accessor: "item_sold",
    },
    {
      Header: "Amount Owed",
      accessor: "owed_amount",
    },
    {
      Header: "Total Revenue",
      accessor: "total_revenue",
    },
    {
      Header: "Actions",
      Cell: ({ row }: any) => (
        <button
          onClick={() => {
            setSelectedVolunteer(row.original);
            setModalIsOpen(true);
          }}
        >
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
          <i className="fas fa-edit" style={{ color: 'blue', cursor: 'pointer' }}></i>
        </button>
      ),
    },
  ], []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search by name..."
            className="text-black p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="p-2 border border-gray-300 rounded text-black bg-blue-500 hover:bg-blue-600">
            Search
          </button>
        </div>
        <button onClick={handleAddVolunteerClick} className="p-2 border border-gray-300 rounded text-black bg-green-500 hover:bg-green-600">
          Add a Volunteer
        </button>
      </div>
      <DynamicTable
        columns={columns}
        data={volunteers.filter(volunteer => volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()))}
        onSave={handleUpdateVolunteer}
      />
      <AddVolunteerPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Volunteer Delete Confirmation"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-bold">Confirm Delete</h2>
          {selectedVolunteer && (
            <p>
              Are you sure you want to delete {selectedVolunteer.name}?
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
              onClick={() => setModalIsOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VolunteerPage;
