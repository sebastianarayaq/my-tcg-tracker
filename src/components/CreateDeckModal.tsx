import React, { useState } from "react";

interface CreateDeckModalProps {
  onClose: () => void;
  onCreate: (name: string, format: string, cardList: string) => void;
}

const CreateDeckModal: React.FC<CreateDeckModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [format, setFormat] = useState("Standard");
  const [cardList, setCardList] = useState("");

  const handleCreate = () => {
    if (!name.trim() || !cardList.trim()) return;
    onCreate(name, format, cardList);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-primary mb-4">➕ Crear Nuevo Mazo</h2>

        <input
          type="text"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del mazo"
        />

        <select
          className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-3"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="Standard">Standard</option>
          <option value="Expanded">Expanded</option>
        </select>

        <textarea
          className="border border-gray-300 rounded-lg px-4 py-2 w-full h-32 mb-3"
          value={cardList}
          onChange={(e) => setCardList(e.target.value)}
          placeholder="Listado de cartas..."
        />

        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition w-full"
            onClick={handleCreate}
          >
            ✅ Guardar
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition w-full"
            onClick={onClose}
          >
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDeckModal;
