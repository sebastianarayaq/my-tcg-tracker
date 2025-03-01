import { useEffect, useState } from "react";
import { getDecks, createDeck, deleteDeck, updateDeck } from "../services/deckService";

interface Deck {
  id: string;
  name: string;
  format: string;
  cardList: string;
}

interface DeckManagerProps {
  profileId: string;
  onBack: () => void;
}

const DeckManager: React.FC<DeckManagerProps> = ({ profileId, onBack }) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [newName, setNewName] = useState("");
  const [newFormat, setNewFormat] = useState("Standard");
  const [newCardList, setNewCardList] = useState("");

  useEffect(() => {
    const fetchDecks = async () => {
      const data = await getDecks(profileId);
      setDecks(data);
    };
    fetchDecks();
  }, [profileId]);

  const handleCreate = async () => {
    if (!newName || !newCardList) return;

    await createDeck(profileId, newName, newFormat, newCardList);
    const updatedDecks = await getDecks(profileId);
    setDecks(updatedDecks);

    setShowModal(false);
    setNewName("");
    setNewCardList("");
  };

  const handleDelete = async (id: string) => {
    await deleteDeck(profileId, id);
    setDecks(decks.filter((d) => d.id !== id));
  };

  const handleViewDeck = (deck: Deck) => {
    setSelectedDeck(deck);
    setShowViewModal(true);
  };

  const handleUpdateDeck = async (deck: Deck) => {
    if (!deck.id) return;

    await updateDeck(profileId, deck.id, { cardList: deck.cardList });
    const updatedDecks = await getDecks(profileId);
    setDecks(updatedDecks);

    setShowViewModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl text-center border border-gray-200">
        <h2 className="text-3xl font-bold text-primary mb-6">Gestión de Mazos</h2>

        <div className="flex justify-between mb-4">
          <button className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-700 transition" onClick={onBack}>
            🔙 Volver al Perfil
          </button>

          <button
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            onClick={() => setShowModal(true)}
          >
            ➕ Agregar Mazo
          </button>
        </div>

        {/* Tabla de mazos */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Formato</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {decks.length > 0 ? (
              decks.map((deck) => (
                <tr key={deck.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{deck.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{deck.format}</td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
                      onClick={() => handleViewDeck(deck)}
                    >
                      👀 Ver
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
                      onClick={() => handleDelete(deck.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="border border-gray-300 px-4 py-2 text-gray-500 text-center">
                  No hay mazos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Creación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-primary mb-4">Agregar Nuevo Mazo</h2>

            <input
              type="text"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-3"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre del mazo"
            />

            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-3"
              value={newFormat}
              onChange={(e) => setNewFormat(e.target.value)}
            >
              <option value="Standard">Standard</option>
              <option value="Expanded">Expanded</option>
            </select>

            <textarea
              className="border border-gray-300 rounded-lg px-4 py-2 w-full h-32 mb-3"
              value={newCardList}
              onChange={(e) => setNewCardList(e.target.value)}
              placeholder="Listado de cartas..."
            />

            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition w-full" onClick={handleCreate}>
                ✅ Guardar
              </button>

              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition w-full" onClick={() => setShowModal(false)}>
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Vista de Mazo */}
      {showViewModal && selectedDeck && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-primary mb-4">Mazo: {selectedDeck.name}</h2>
            <h3 className="text-lg text-gray-700 mb-3">Formato: {selectedDeck.format}</h3>

            {/* Área editable para la lista de cartas */}
            <textarea
              className="border border-gray-300 rounded-lg px-4 py-2 w-full h-32 text-sm text-left"
              value={selectedDeck.cardList}
              onChange={(e) => setSelectedDeck({ ...selectedDeck, cardList: e.target.value })}
            />

            <div className="flex space-x-2 mt-4">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition w-full" onClick={() => handleUpdateDeck(selectedDeck)}>
                💾 Guardar Cambios
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition w-full" onClick={() => setShowViewModal(false)}>
                ❌ Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckManager;
