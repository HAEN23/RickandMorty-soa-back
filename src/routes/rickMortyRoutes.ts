import { Router, Request, Response } from 'express';
import { fetchAndCleanPokemonData } from '../services/rickMortyService.';

const router = Router();

router.get('/api/v1/pokemon/:name', async (req: Request, res: Response) => {
  try {
    const name = req.params.name as string;
    
    const pokemonData = await fetchAndCleanPokemonData(name);
    
    
    res.status(200).json(pokemonData);
  } catch (error: any) {
    
    if (error.response && error.response.status === 404) {
      res.status(404).json({ mensaje: "Pokémon no encontrado en la API externa." });
    } else {
      
      console.error("🚨 Error en el Microservicio:", error.message);
      res.status(500).json({ mensaje: "Error al comunicarse con la PokeAPI externa." });
    }
  }
});

export default router;