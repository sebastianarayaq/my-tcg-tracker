import { useState, useEffect } from "react";
import { getProfiles } from "../services/profileService";

interface Profile {
  id: string;
  name: string;
  avatar?: string;
}

interface ProfileSelectorProps {
  onSelect: (profile: Profile) => void;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({ onSelect }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const data = await getProfiles();
      setProfiles(data);
    };
    fetchProfiles();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen px-4" style={{ backgroundImage: "url('/pokemon-bg.jpg')" }}>
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-primary">Selecciona un Perfil</h2>
        <div className="flex flex-col space-y-4">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              className="flex items-center justify-start space-x-4 px-6 py-3 bg-button text-button-text font-semibold rounded-lg shadow-md hover:bg-gray-500 transition w-full"
              onClick={() => onSelect(profile)}
            >
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-12 h-12 rounded-full border border-gray-300 shadow-sm" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-lg">{profile.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSelector;
