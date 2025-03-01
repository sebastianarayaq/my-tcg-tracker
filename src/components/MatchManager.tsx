import { useEffect, useState } from "react";
import { createMatch } from "../services/matchService";
import { getDecks } from "../services/deckService";

interface MatchManagerProps {
  profileId: string;
  onClose: () => void;
}

const MatchManager: React.FC<MatchManagerProps> = ({ profileId, onClose }) => {
  const [decks, setDecks] = useState<{ id: string; name: string }[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string>("");
  const [opponent, setOpponent] = useState("");
  const [result, setResult] = useState<"win" | "draw" | "loss">("win");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchDecks = async () => {
      const deckData = await getDecks(profileId);
      setDecks(deckData);
      if (deckData.length > 0) {
        setSelectedDeck(deckData[0].id); // Selecciona el primer mazo por defecto
      }
    };
    fetchDecks();
  }, [profileId]);

  const handleCreate = async () => {
    if (!selectedDeck || !opponent) return;

    await createMatch(profileId, selectedDeck, opponent, result, notes);
    setOpponent("");
    setNotes("");
    onClose(); // Cerrar modal después de registrar
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-primary mb-4">Registrar Enfrentamiento</h2>

      {/* 🔹 Selector de Mazos */}
      <select
        className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-3"
        value={selectedDeck}
        onChange={(e) => setSelectedDeck(e.target.value)}
      >
        {decks.map((deck) => (
          <option key={deck.id} value={deck.id}>
            {deck.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-3"
        value={opponent}
        onChange={(e) => setOpponent(e.target.value)}
        placeholder="Nombre del oponente"
      />

      <select
        className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-3"
        value={result}
        onChange={(e) => setResult(e.target.value as "win" | "draw" | "loss")}
      >
        <option value="win">Victoria</option>
        <option value="draw">Empate</option>
        <option value="loss">Derrota</option>
      </select>

      <textarea
        className="border border-gray-300 rounded-lg px-4 py-2 w-full h-32 mb-3"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notas sobre la partida..."
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
  );
};

export default MatchManager;
