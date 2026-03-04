import axios from 'axios';
import { config } from '../config/env';

export const fetchAndCleanPokemonData = async (pokemonName: string) => {
  // 1. Petición a la API externa de terceros
  const response = await axios.get(`${config.pokeApiUrl}/${pokemonName.toLowerCase()}`);
  const rawData = response.data;

  // 2. Limpieza de datos (Mapeo)
  // Extraemos solo lo que necesitamos del JSON gigante de la PokeAPI
  const cleanedData = {
    name: rawData.name,
    // Buscamos la imagen oficial de alta calidad, si no existe, usamos el sprite básico
    image: rawData.sprites.other['official-artwork'].front_default || rawData.sprites.front_default,
    // Convertimos el arreglo complejo de tipos en un arreglo simple de textos (strings)
    types: rawData.types.map((t: any) => t.type.name),
  };

  return cleanedData;
};