import { useState } from "react";
import { createMatch } from "../services/matchService";

interface MatchManagerProps {
  profileId: string;
  deckId: string;
  availableDecks: { id: string; name: string }[];
  onClose: () => void;
}

const MatchManager: React.FC<MatchManagerProps> = ({ profileId, deckId, availableDecks, onClose }) => {
  const [selectedDeckId, setSelectedDeckId] = useState(deckId || (availableDecks.length > 0 ? availableDecks[0].id : ""));
  const [opponent, setOpponent] = useState("");
  const [result, setResult] = useState<"win" | "draw" | "loss">("win");
  const [notes, setNotes] = useState("");

  const handleCreate = async () => {
    if (!selectedDeckId || !opponent) return;

    await createMatch(profileId, selectedDeckId, opponent, result, notes);
    onClose(); // 🔹 Cerrar el modal y actualizar la tabla en `MatchHistory.tsx`
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-primary mb-4">Registrar Enfrentamiento</h2>

        {/* Selector de mazo */}
        <select
          className="border rounded px-3 py-2 w-full mb-2"
          value={selectedDeckId}
          onChange={(e) => setSelectedDeckId(e.target.value)}
        >
          {availableDecks.map((deck) => (
            <option key={deck.id} value={deck.id}>
              {deck.name}
            </option>
          ))}
        </select>

        {/* Ingreso del nombre del oponente */}
        <input
          type="text"
          className="border rounded px-3 py-2 w-full mb-2"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          placeholder="Nombre del oponente"
        />

        {/* Selector de resultado */}
        <select
          className="border rounded px-3 py-2 w-full mb-2"
          value={result}
          onChange={(e) => setResult(e.target.value as "win" | "draw" | "loss")}
        >
          <option value="win">Victoria</option>
          <option value="draw">Empate</option>
          <option value="loss">Derrota</option>
        </select>

        {/* Área de notas */}
        <textarea
          className="border rounded px-3 py-2 w-full h-32 mb-2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas sobre la partida..."
        />

        {/* Botones de acción */}
        <div className="flex space-x-2 mt-4">
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

export default MatchManager;
