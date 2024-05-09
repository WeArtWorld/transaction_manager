import React, { useEffect, useState } from "react";
import DynamicTable from "../components/dynamicTable";
import AddSalePopup from '../components/addSalePopup';
import { Column } from "react-table";
import Modal from "react-modal";

Modal.setAppElement("#__next");

interface Sale {
  key: string;
  article: string;
  comment: string;
  completed_payment: boolean;
  date: string;
  payment_method: string;
  pick_up: boolean;
  price: string;
  volunteer_name: string;
}

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Sales.json');
        const data = await response.json();
        const loadedSales = Object.entries(data).map(([key, item]: [string, any]) => ({
          key: key,
          article: item.article,
          comment: item.comment,
          completed_payment: item.completed_payment,
          date: item.date,
          payment_method: item.payment_method,
          pick_up: item.pick_up,
          price: item.price,
          volunteer_name: item.volunteer_name,
        }));
        setSales(loadedSales);
      } catch (error) {
        console.error('Error retrieving sales:', error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (saleKey: string) => {
    const sale = sales.find(a => a.key === saleKey);
    if (sale) {
      setSelectedSale(sale);
      setModalIsOpen(true);
    }
  };

  const handleUpdateSale = async (updatedSale: Sale) => {
    const { key, ...updateData } = updatedSale;
    try {
      await fetch(`https://transactions-man-default-rtdb.firebaseio.com/Sales/${updatedSale.key}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      setSales(sales.map(a => a.key === key ? { ...a, ...updateData } : a));
      setModalIsOpen(false);
    } catch (error) {
      console.error('Failed to update sale', error);
    }
  };

  const handleAddSaleClick = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleDelete = async () => {
    if (selectedSale) {
      try {
        await fetch(
          `https://transactions-man-default-rtdb.firebaseio.com/Sales/${selectedSale.key}.json`,
          {
            method: "DELETE",
          }
        );
        setSales(
          sales.filter((sale) => sale.key !== selectedSale.key)
        );
        setModalIsOpen(false);
        setSelectedSale(null);
      } catch (error) {
        console.error("Error deleting sale:", error);
      }
    }
  };

  const columns: Column<Sale>[] = React.useMemo(() => [
    {
      Header: "Article",
      accessor: "article",
    },
    {
      Header: "Comment",
      accessor: "comment",
    },
    {
      Header: "Date",
      accessor: "date",
    },
    {
      Header: "Payment Method",
      accessor: "payment_method",
    },
    {
      Header: "Pick Up",
      accessor: "pick_up",
    },
    {
      Header: "Price",
      accessor: "price",
    },
    {
      Header: "Volunteer Name",
      accessor: "volunteer_name",
    },
    {
      Header: "Actions",
      Cell: ({ row }: any) => (
        <button
          onClick={() => {
            setSelectedSale(row.original);
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
            placeholder="Search by article or volunteer name..."
            className="text-black p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="p-2 border border-gray-300 rounded text-black bg-blue-500 hover:bg-blue-600">
            Search
          </button>
        </div>
        <button onClick={handleAddSaleClick} className="p-2 border border-gray-300 rounded text-black bg-green-500 hover:bg-green-600">
          Add a Sale
        </button>
      </div>
      <DynamicTable
        columns={columns}
        data={sales.filter(sale => sale.article.toLowerCase().includes(searchTerm.toLowerCase()) || sale.volunteer_name.toLowerCase().includes(searchTerm.toLowerCase()))}
        onSave={handleUpdateSale}
      />
      <AddSalePopup isOpen={isPopupOpen} onClose={handleClosePopup} />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Delete Confirmation"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-bold">Confirm Delete</h2>
          {selectedSale && (
            <p>
              Are you sure you want to delete the sale of {selectedSale.article} by {selectedSale.volunteer_name}?
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

export default SalesPage;