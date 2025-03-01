import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";

interface Match {
  id?: string;
  opponent: string;
  result: "win" | "draw" | "loss";
  notes?: string;
  date?: Date;
  deckId: string;
}

// 🔹 Obtener los enfrentamientos de un mazo específico dentro de un perfil
export const getMatches = async (profileId: string, deckId: string) => {
  if (!profileId || !deckId) return [];

  const matchesCollection = collection(db, "profiles", profileId, "decks", deckId, "matches"); // ✅ Ruta corregida
  const snapshot = await getDocs(matchesCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    deckId,
    ...doc.data(),
  })) as Match[];
};

// 🔹 Registrar un nuevo enfrentamiento dentro de un deck
export const createMatch = async (
  profileId: string,
  deckId: string,
  opponent: string,
  result: "win" | "draw" | "loss",
  notes?: string
) => {
  if (!profileId || !deckId) throw new Error("profileId y deckId son requeridos.");

  const matchesCollection = collection(db, "profiles", profileId, "decks", deckId, "matches"); // ✅ Ruta corregida
  const newMatch: Match = {
    opponent,
    result,
    notes: notes || "",
    date: new Date(),
    deckId,
  };

  const docRef = await addDoc(matchesCollection, newMatch);
  return { id: docRef.id, ...newMatch };
};

// 🔹 Eliminar un enfrentamiento de un mazo específico
export const deleteMatch = async (profileId: string, deckId: string, matchId: string) => {
  if (!profileId || !deckId || !matchId) throw new Error("profileId, deckId y matchId son requeridos.");

  await deleteDoc(doc(db, "profiles", profileId, "decks", deckId, "matches", matchId)); // ✅ Ruta corregida
};
