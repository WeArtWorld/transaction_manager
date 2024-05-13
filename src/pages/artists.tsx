import React, { useEffect, useState } from "react";
import DynamicTable from "../components/dynamicTable";
import AddArtistPopup from '../components/addArtistPopUp';
import { Column } from "react-table";
import Modal from "react-modal";
import { Dialog } from "@headlessui/react";

Modal.setAppElement("#__next");

interface Artist {
  key: string;
  name: string;
  email: string;
  category: string;
  item_sold: number;
  total_revenue: number;
  // Assuming 'owed_amount' has been added to your data structure
  owed_amount: number;
}

const ArtistPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddArtistPopupOpen, setAddArtistPopupOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Artists.json');
        const data = await response.json();
        const loadedArtists = Object.entries(data).map(([key, item]: [string, any]) => ({
          key: key,
          name: item.name,
          email: item.email,
          category: item.category,
          item_sold: item.totalVente,
          total_revenue: item.montantDu,
          owed_amount: item.owed_amount,
        }));
        setArtists(loadedArtists);
      } catch (error) {
        console.error('Erreur lors de la récupération des artistes:', error);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = (artist: Artist) => {
    setSelectedArtist(artist);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (artist: Artist) => {
    setSelectedArtist(artist);
    setDeleteModalOpen(true);
  };

  const handleUpdateArtist = async (updatedArtist: Artist) => {
    const { key, ...updateData } = updatedArtist;
    try {
      await fetch(`https://transactions-man-default-rtdb.firebaseio.com/Artists/${key}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      setArtists(artists.map(a => a.key === key ? { ...a, ...updateData } : a));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update artist:', error);
    }
  };

  const handleAddArtistClick = () => {
    setAddArtistPopupOpen(true);
  };

  const handleDelete = async () => {
    if (selectedArtist) {
      try {
        await fetch(`https://transactions-man-default-rtdb.firebaseio.com/Artists/${selectedArtist.key}.json`, {
          method: "DELETE",
        });
        setArtists(artists.filter((artist) => artist.key !== selectedArtist.key));
        setDeleteModalOpen(false);
        setSelectedArtist(null);
      } catch (error) {
        console.error("Error deleting artist:", error);
      }
    }
  };

  const columns: Column<Artist>[] = React.useMemo(() => [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Category",
      accessor: "category",
    },
    {
      Header: "Total Sales",
      accessor: "item_sold",
    },
    {
      Header: "Generated Revenue",
      accessor: "total_revenue",
    },
    {
      Header: "Actions",
      Cell: ({ row }: any) => (
        <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
          <button onClick={() => handleEditClick(row.original)}>
            <i className="fas fa-edit" style={{ color: 'blue', cursor: 'pointer' }}></i>
          </button>
          <button onClick={() => handleDeleteClick(row.original)}>
            <i className="fas fa-trash" style={{ color: 'red', cursor: 'pointer' }}></i>
          </button>
        </>
      ),
    },
  ], []);

  return (
    <>
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
          <button onClick={handleAddArtistClick} className="p-2 border border-gray-300 rounded text-black bg-green-500 hover:bg-green-600">
            Add an Artist
          </button>
        </div>
        <DynamicTable
          columns={columns}
          data={artists.filter(artist => artist.name.toLowerCase().includes(searchTerm.toLowerCase()))}
          onSave={handleUpdateArtist}
        />
        <AddArtistPopup isOpen={isAddArtistPopupOpen} onClose={() => setAddArtistPopupOpen(false)} />
        <Modal
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setDeleteModalOpen(false)}
          contentLabel="Delete Confirmation"
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-bold">Confirm Delete</h2>
            {selectedArtist && <p>Are you sure you want to delete {selectedArtist.name}?</p>}
            <div>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Delete
              </button>
              <button onClick={() => setDeleteModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
        <Dialog
          open={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-lg shadow">
              <Dialog.Title className="text-lg font-bold">Edit Details</Dialog.Title>
              <form className="flex flex-col space-y-4">
                {selectedArtist && Object.keys(selectedArtist).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      value={(selectedArtist as any)[key]}
                      onChange={(e) => {
                        const updated = { ...selectedArtist, [key]: e.target.value };
                        setSelectedArtist(updated);
                      }}
                      className="mt-1 block w-full p-2 border text-black border-gray-300 rounded shadow-sm sm:text-sm"
                      readOnly={key === "key"}
                      style={key === "key" ? { backgroundColor: "#647689", color: "#495057" } : {}}
                    />
                  </div>
                ))}
                <div className="flex justify-end mt-4">
                  <button onClick={() => setEditModalOpen(false)} className="mr-2 px-4 py-2 text-gray-700 border rounded">
                    Cancel
                  </button>
                  <button onClick={() => {
                    handleUpdateArtist(selectedArtist!); // Ensure not null when calling update
                  }} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default ArtistPage;