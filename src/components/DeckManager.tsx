import { useEffect, useState } from "react";
import axios from "axios";
import { getDecks, createDeck, deleteDeck, updateDeck } from "../services/deckService";
import CreateDeckModal from "./CreateDeckModal"; // ✅ Importar modal de creación

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
  const [loadingDecks, setLoadingDecks] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [cardImages, setCardImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    const fetchDecks = async () => {
      setLoadingDecks(true);
      const data = await getDecks(profileId);
      setDecks(data);
      setLoadingDecks(false);
    };
    fetchDecks();
  }, [profileId]);

  const handleDelete = async (id: string) => {
    await deleteDeck(profileId, id);
    setDecks(decks.filter((d) => d.id !== id));
  };

  const handleCreateDeck = async (name: string, format: string, cardList: string) => {
    await createDeck(profileId, name, format, cardList);
    const updatedDecks = await getDecks(profileId);
    setDecks(updatedDecks);
    setShowCreateModal(false);
  };

  const handleViewDeck = async (deck: Deck) => {
    setSelectedDeck(deck);
    setShowViewModal(true);
    setLoadingImages(true);

    const cardEntries = deck.cardList
      .split("\n")
      .map((line) => {
        const parts = line.trim().split(" ");
        if (parts.length < 3) return null;
        const name = parts.slice(1, -2).join(" ");
        const setCode = parts.slice(-2, -1)[0]?.toLowerCase();
        const number = parts.slice(-1)[0];
        return { name, setCode, number };
      })
      .filter((entry): entry is { name: string; setCode: string; number: string } => entry !== null);

    const setIds: Record<string, string> = {};
    await Promise.all(
      [...new Set(cardEntries.map((entry) => entry.setCode))].map(async (setCode) => {
        try {
          const { data } = await axios.get(`https://api.pokemontcg.io/v2/sets?q=ptcgoCode:${setCode}`);
          if (data.data.length > 0) {
            setIds[setCode] = data.data[0].id;
          }
        } catch (error) {
          console.error(`Error obteniendo set ID para ${setCode}:`, error);
        }
      })
    );

    const fetchedImages = await Promise.all(
      cardEntries.map(async ({ setCode, number }) => {
        if (!setIds[setCode]) return "";

        try {
          const { data } = await axios.get(`https://api.pokemontcg.io/v2/cards?q=id:${setIds[setCode]}-${number}`);
          return data.data?.[0]?.images?.small || "";
        } catch (error) {
          console.error(`Error obteniendo imagen para ${setIds[setCode]}-${number}:`, error);
          return "";
        }
      })
    );

    setCardImages(fetchedImages.filter((img) => img));
    setLoadingImages(false);
  };

  const handleUpdateDeck = async () => {
    if (!selectedDeck) return;

    await updateDeck(profileId, selectedDeck.id, { cardList: selectedDeck.cardList });
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

          <button className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-700 transition" onClick={() => setShowCreateModal(true)}>
            ➕ Agregar Mazo
          </button>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Formato</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loadingDecks
              ? [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="border border-gray-300 px-4 py-2"><div className="w-24 h-4 bg-gray-300 rounded"></div></td>
                    <td className="border border-gray-300 px-4 py-2"><div className="w-16 h-4 bg-gray-300 rounded"></div></td>
                    <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                      <div className="w-10 h-6 bg-gray-300 rounded"></div>
                      <div className="w-10 h-6 bg-gray-300 rounded"></div>
                    </td>
                  </tr>
                ))
              : decks.map((deck) => (
                  <tr key={deck.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{deck.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{deck.format}</td>
                    <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition" onClick={() => handleViewDeck(deck)}>
                        👀 Ver
                      </button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-700 transition" onClick={() => handleDelete(deck.id)}>
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && <CreateDeckModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateDeck} />}

      {showViewModal && selectedDeck && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-primary mb-4">Mazo: {selectedDeck.name}</h2>

            <textarea className="w-full h-32 border border-gray-300 rounded-lg p-2" value={selectedDeck.cardList} onChange={(e) => setSelectedDeck({ ...selectedDeck, cardList: e.target.value })} />

            <div className="overflow-x-auto whitespace-nowrap border-t pt-4 mt-2 flex space-x-2">
              {loadingImages ? [...Array(5)].map((_, i) => <div key={i} className="w-24 h-32 bg-gray-300 rounded-md"></div>) : cardImages.map((img, i) => <img key={i} src={img} className="w-24 h-32 rounded-md shadow-md" />)}
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition w-full" onClick={handleUpdateDeck}>
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
