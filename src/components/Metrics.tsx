import { useEffect, useState } from "react";
import { getMatches } from "../services/matchService";
import { getDecks } from "../services/deckService";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Match {
  id: string;
  opponent: string;
  result: "win" | "draw" | "loss";
  deckId: string;
}

interface Deck {
  id: string;
  name: string;
}

interface MetricsProps {
  profileId: string;
  onBack: () => void;
}

const Metrics: React.FC<MetricsProps> = ({ profileId, onBack }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      const deckData = await getDecks(profileId);
      setDecks(deckData);

      let allMatches: Match[] = [];
      for (const deck of deckData) {
        const deckMatches = await getMatches(profileId, deck.id);
        allMatches = [...allMatches, ...deckMatches.map(match => ({ ...match, deckId: deck.id }))];
      }
      setMatches(allMatches);
    };

    fetchData();
  }, [profileId]);

  const filteredMatches = selectedDeck === "all" ? matches : matches.filter(match => match.deckId === selectedDeck);

  // Cálculo del winrate
  const totalMatches = filteredMatches.length;
  const wins = filteredMatches.filter(match => match.result === "win").length;
  const draws = filteredMatches.filter(match => match.result === "draw").length;
  const losses = filteredMatches.filter(match => match.result === "loss").length;
  const winrate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(2) : "0";

  // Datos para gráfico
  const pieData = [
    { name: "Victorias", value: wins, color: "#4CAF50" },
    { name: "Empates", value: draws, color: "#FFC107" },
    { name: "Derrotas", value: losses, color: "#F44336" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl text-center border border-gray-200">
        <h2 className="text-3xl font-bold text-primary mb-6">📊 Métricas y Estadísticas</h2>

        <div className="flex justify-between mb-4">
          <button className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-700 transition" onClick={onBack}>
            🔙 Volver al Perfil
          </button>
        </div>

        {/* Selector de mazo */}
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

        {/* Tabla de enfrentamientos */}
        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Deck</th>
              <th className="border border-gray-300 px-4 py-2">Oponente</th>
              <th className="border border-gray-300 px-4 py-2">Resultado</th>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="border border-gray-300 px-4 py-2 text-gray-500 text-center">
                  No hay enfrentamientos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Estadísticas generales */}
        <div className="text-xl font-semibold">
          <p>🔢 Total de Partidas: {totalMatches}</p>
          <p>🏆 Winrate: {winrate}%</p>
        </div>

        {/* Gráfico de victorias/empates/derrotas */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Metrics;
