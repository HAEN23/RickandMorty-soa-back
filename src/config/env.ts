import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3002,
  pokeApiUrl: process.env.POKEAPI_URL || 'https://rickandmortyapi.com/api/character',
};