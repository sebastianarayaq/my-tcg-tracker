import { useEffect, useState } from "react";
import { getMatches } from "../services/matchService";
import { getDecks } from "../services/deckService";
import MatchManager from "./MatchManager";

interface Match {
  id: string;
  opponent: string;
  result: "win" | "draw" | "loss";
  notes: string;
  deckId: string;
}

interface Deck {
  id: string;
  name: string;
}

interface MatchHistoryProps {
  profileId: string;
  onBack: () => void;
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ profileId, onBack }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string>("all");
  const [showMatchManager, setShowMatchManager] = useState(false);
  const [selectedDeckForMatch, setSelectedDeckForMatch] = useState<string | null>(null);

  useEffect(() => {
    const fetchDecksAndMatches = async () => {
      const deckData = await getDecks(profileId);
      setDecks(deckData);
  
      let allMatches: Match[] = [];
  
      for (const deck of deckData) {
        const deckMatches = await getMatches(profileId, deck.id);
        const uniqueMatches = deckMatches.map(match => ({
          ...match,
          deckId: deck.id // 🔹 Asegurar que cada match tiene su deckId correcto
        }));
  
        allMatches = [...allMatches, ...uniqueMatches];
      }
  
      // 🔹 Eliminar duplicados usando un Set basado en IDs únicos
      const filteredMatches = Array.from(new Map(allMatches.map(m => [m.id, m])).values());
  
      setMatches(filteredMatches);
    };
  
    fetchDecksAndMatches();
  }, [profileId]);

  const filteredMatches = selectedDeck === "all" ? matches : matches.filter(match => match.deckId === selectedDeck);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl text-center border border-gray-200">
        <h2 className="text-3xl font-bold text-primary mb-6">Historial de Enfrentamientos</h2>

        <div className="flex justify-between space-x-2 mb-4">
          <button className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-700 transition" onClick={onBack}>
            🔙 Volver al Perfil
          </button>

          <button
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            onClick={() => setShowMatchManager(true)}
          >
            ➕ Registrar Enfrentamiento
          </button>
        </div>

        <select
          className="border rounded px-3 py-2 mb-4 w-full"
          value={selectedDeck}
          onChange={(e) => setSelectedDeck(e.target.value)}
        >
          <option value="all">Todos los Decks</option>
          {decks.map((deck) => (
            <option key={deck.id} value={deck.id}>
              {deck.name}
            </option>
          ))}
        </select>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Deck</th>
              <th className="border border-gray-300 px-4 py-2">Oponente</th>
              <th className="border border-gray-300 px-4 py-2">Resultado</th>
              <th className="border border-gray-300 px-4 py-2">Notas</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <tr key={match.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{decks.find(d => d.id === match.deckId)?.name || "Desconocido"}</td>
                  <td className="border border-gray-300 px-4 py-2">{match.opponent}</td>
                  <td className={`border border-gray-300 px-4 py-2 font-bold ${match.result === "win" ? "text-green-600" : match.result === "draw" ? "text-gray-600" : "text-red-600"}`}>
                    {match.result === "win" ? "Victoria" : match.result === "draw" ? "Empate" : "Derrota"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{match.notes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="border border-gray-300 px-4 py-2 text-gray-500">No hay enfrentamientos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar enfrentamiento */}
      {showMatchManager && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
          <MatchManager profileId={profileId} deckId={selectedDeckForMatch || ""} onClose={() => setShowMatchManager(false)} />
        </div>
      )}
    </div>
  );
};

export default MatchHistory;
