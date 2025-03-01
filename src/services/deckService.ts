import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

interface Deck {
    id?: string;
    name: string;
    format: string;
    cardList: string; // Se agrega esta propiedad
    createdAt?: Date;
  }

// Obtener mazos de un perfil
export const getDecks = async (profileId: string) => {
    const decksCollection = collection(db, "profiles", profileId, "mazos");
    const snapshot = await getDocs(decksCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      format: doc.data().format,
      cardList: doc.data().cardList || "", // Asegura que cardList siempre tenga un valor
      createdAt: doc.data().createdAt,
    })) as Deck[];
  };

// Crear un mazo
export const createDeck = async (profileId: string, name: string, format: string, cardList: string) => {
    const decksCollection = collection(db, "profiles", profileId, "mazos");
    const newDeck: Deck = { name, format, cardList, createdAt: new Date() }; // Se agrega cardList
    const docRef = await addDoc(decksCollection, newDeck);
    return { id: docRef.id, ...newDeck };
  };

  // Actualizar mazo
export const updateDeck = async (profileId: string, deckId: string, updatedFields: Partial<Deck>) => {
    const deckRef = doc(db, "profiles", profileId, "mazos", deckId);
    await updateDoc(deckRef, updatedFields);
};

// Eliminar un mazo
export const deleteDeck = async (profileId: string, deckId: string) => {
  await deleteDoc(doc(db, "profiles", profileId, "mazos", deckId));
};
