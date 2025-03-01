import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";

const profilesCollection = collection(db, "profiles");

// Crear un nuevo perfil
export const createProfile = async (name: string, avatar?: string) => {
  const newProfile = { name, avatar: avatar || "" };
  const docRef = await addDoc(profilesCollection, newProfile);
  return { id: docRef.id, ...newProfile };
};

// Obtener todos los perfiles
export const getProfiles = async () => {
  const snapshot = await getDocs(profilesCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Eliminar un perfil
export const deleteProfile = async (profileId: string) => {
  await deleteDoc(doc(db, "profiles", profileId));
};
