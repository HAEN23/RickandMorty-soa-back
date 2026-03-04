import axios from 'axios';
import { config } from '../config/env';

export const fetchAndCleanPokemonData = async (pokemonName: string) => {
  
  const response = await axios.get(`${config.pokeApiUrl}/?name=${pokemonName.toLowerCase()}`);
  const rawData = response.data.results[0];

 
  const cleanedData = {
    name: rawData.name,
    
    image: rawData.image,
    
    types: [rawData.status, rawData.species],
  };

  return cleanedData;
};