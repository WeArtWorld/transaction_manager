import React, { useEffect, useState } from "react";
import DynamicTable from "../components/dynamicTable";
import AddArtistPopup from '../components/addArtistPopUp';
import { Column } from "react-table";
import Modal from "react-modal";

Modal.setAppElement("#__next");

interface Artist {
  key: string;
  name: string;
  email: string;
  category: string;
  item_sold: number;
  total_revenue: number;
}

const ArtistPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
        }));
        setArtists(loadedArtists);
      } catch (error) {
        console.error('Erreur lors de la récupération des artistes:', error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (artistKey: string) => {
    const artist = artists.find(a => a.key === artistKey);
    if (artist) {
      setSelectedArtist(artist);
      setModalIsOpen(true);
    }
  };

  const handleUpdateArtist = async (updatedArtist: Artist) => {
    const { key, ...updateData } = updatedArtist;
    try {
      await fetch(`https://transactions-man-default-rtdb.firebaseio.com/Artists/${updatedArtist.key}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      setArtists(artists.map(a => a.key === key ? { ...a, ...updateData } : a));
      setModalIsOpen(false);
    } catch (error) {
      console.error('Failed to update artist', error);
    }
  };

  const handleAddArtistClick = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleDelete = async () => {
    if (selectedArtist) {
      try {
        await fetch(
          `https://transactions-man-default-rtdb.firebaseio.com/Artists/${selectedArtist.key}.json`,
          {
            method: "DELETE",
          }
        );
        setArtists(
          artists.filter((artist) => artist.key !== selectedArtist.key)
        );
        setModalIsOpen(false);
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
      Header: "Total vente",
      accessor: "item_sold",
    },
    {
      Header: "Revenu Généré",
      accessor: "total_revenue",
    },
    {
      Header: "Actions",
      Cell: ({ row }: any) => (
        

        <button
          onClick={() => {
            setSelectedArtist(row.original);
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
        <button onClick={handleAddArtistClick} className="p-2 border border-gray-300 rounded text-black bg-green-500 hover:bg-green-600">
          Add an Artist
        </button>
      </div>
      <DynamicTable
        columns={columns}
        data={artists.filter(artist => artist.name.toLowerCase().includes(searchTerm.toLowerCase()))}
        onSave={handleUpdateArtist}
      />
      <AddArtistPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Delete Confirmation"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-bold">Confirm Delete</h2>
          {selectedArtist && (
            <p>
              Are you sure you want to delete {selectedArtist.name}?
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

export default ArtistPage;
