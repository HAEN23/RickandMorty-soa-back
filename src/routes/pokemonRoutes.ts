import { Router, Request, Response } from 'express';
import { fetchAndCleanPokemonData } from '../services/pokeApiService';

const router = Router();

router.get('/api/v1/pokemon/:name', async (req: Request, res: Response) => {
  try {
    const name = req.params.name as string;
    
    const pokemonData = await fetchAndCleanPokemonData(name);
    
    // Enviamos el JSON limpio al API Gateway
    res.status(200).json(pokemonData);
  } catch (error: any) {
    // Si la PokeAPI responde con 404 (No encontrado)
    if (error.response && error.response.status === 404) {
      res.status(404).json({ mensaje: "Pokémon no encontrado en la API externa." });
    } else {
      // Si la PokeAPI se cae o hay un problema de red
      console.error("🚨 Error en el Microservicio:", error.message);
      res.status(500).json({ mensaje: "Error al comunicarse con la PokeAPI externa." });
    }
  }
});

export default router;