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

// 🔹 Obtener los enfrentamientos **de un mazo específico** dentro de un perfil
export const getMatches = async (profileId: string, deckId: string) => {
    const matchesCollection = collection(db, "profiles", profileId, "decks", deckId, "matches"); // 🔥 Corregir ruta para que cada match esté dentro del deck correspondiente
    const snapshot = await getDocs(matchesCollection);
  
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      deckId, // 🔹 Asociar el match con su deck correctamente
      ...doc.data()
    })) as Match[];
};
  
// 🔹 Registrar un nuevo enfrentamiento dentro de un **deck específico**
export const createMatch = async (profileId: string, deckId: string, opponent: string, result: "win" | "draw" | "loss", notes?: string) => {
    const matchesCollection = collection(db, "profiles", profileId, "decks", deckId, "matches"); // 🔥 Guardar cada match dentro del deck correspondiente
    const newMatch: Match = { opponent, result, notes: notes || "", date: new Date(), deckId };
    const docRef = await addDoc(matchesCollection, newMatch);
    return { id: docRef.id, ...newMatch };
};
  
// 🔹 Eliminar un enfrentamiento de un mazo específico
export const deleteMatch = async (profileId: string, deckId: string, matchId: string) => {
    await deleteDoc(doc(db, "profiles", profileId, "decks", deckId, "matches", matchId)); // 🔥 Asegurar que se elimina correctamente desde la estructura correcta
};
