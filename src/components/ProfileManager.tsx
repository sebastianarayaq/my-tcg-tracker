import { useState } from "react";
import ProfileSelector from "./ProfileSelector";
import DeckManager from "./DeckManager";
import MatchHistory from "./MatchHistory";
import Metrics from "./Metrics"; 


interface Profile {
  id: string;
  name: string;
  avatar?: string;
}

const ProfileManager: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [viewDecks, setViewDecks] = useState(false);
  const [viewMatches, setViewMatches] = useState(false);
  const [viewMetrics, setViewMetrics] = useState(false);

  if (!selectedProfile) {
    return <ProfileSelector onSelect={setSelectedProfile} />;
  }

  if (viewDecks) {
    return <DeckManager profileId={selectedProfile.id} onBack={() => setViewDecks(false)} />;
  }

  if (viewMatches) {
    return <MatchHistory profileId={selectedProfile.id} onBack={() => setViewMatches(false)} />;
  }

  if (viewMetrics) {
    return <Metrics profileId={selectedProfile.id} onBack={() => setViewMetrics(false)} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center border border-gray-200">
        <h1 className="text-3xl font-bold text-primary mb-6">Bienvenido, {selectedProfile.name} 👋</h1>
        
        <div className="flex flex-col space-y-4">
          <button
            className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition w-full"
            onClick={() => setViewDecks(true)}
          >
            📖 Ver Decks
          </button>
          
          <button
            className="flex items-center justify-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition w-full"
            onClick={() => setViewMatches(true)}
          >
            🏆 Ver Enfrentamientos
          </button>

          <button
            className="flex items-center justify-center px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition w-full"
            onClick={() => setViewMetrics(true)}
            >
            📊 Ver Métricas
          </button>

          
          <button
            className="flex items-center justify-center px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition w-full"
            onClick={() => setSelectedProfile(null)}
          >
            🔄 Cambiar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;
