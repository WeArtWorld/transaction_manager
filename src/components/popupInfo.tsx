import React from 'react';

interface PopupProps {
  item: any;
  onClose: () => void;
}

const DetailPopup: React.FC<PopupProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-xl font-bold">{item.article}</h2>
        <ul>
          {Object.keys(item).map((key) => (
            <li key={key}>
              <strong>{key}:</strong> {item[key]}
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default DetailPopup;
