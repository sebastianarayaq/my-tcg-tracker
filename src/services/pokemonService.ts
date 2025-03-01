import axios from "axios";

const API_URL = "https://api.pokemontcg.io/v2/cards";
const API_KEY = import.meta.env.VITE_POKEMON_TCG_API_KEY;

// 🔍 Buscar cartas por nombre
export const searchCards = async (query: string) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { "X-Api-Key": API_KEY },
      params: { q: `name:${query}*`, pageSize: 10 }, // Busca cartas que empiecen con "query"
    });
    return response.data.data; // Devuelve la lista de cartas encontradas
  } catch (error) {
    console.error("Error al buscar cartas:", error);
    return [];
  }
};

// 🔹 Obtener una carta por ID
export const getCardById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { "X-Api-Key": API_KEY },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener carta:", error);
    return null;
  }
};

export const getCardByName = async (name: string) => {
    try {
      const response = await axios.get(API_URL, {
        headers: { "X-Api-Key": API_KEY },
        params: { q: `name:"${name}"`, pageSize: 1 }, // Busca la carta exacta
      });
      return response.data.data[0]?.images?.small || "";
    } catch (error) {
      console.error("Error al obtener imagen de carta:", error);
      return "";
    }
  };
