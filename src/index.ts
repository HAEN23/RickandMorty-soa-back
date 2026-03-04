import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import pokemonRoutes from './routes/pokemonRoutes';

const app = express();

app.use(express.json());
// Permitimos que CUALQUIER Gateway local lo consuma (en producción se limitaría a la IP del Gateway)
app.use(cors()); 

app.use(pokemonRoutes);

app.listen(config.port, () => {
  console.log(`🔌 Microservicio PokeAPI conectado y escuchando en http://localhost:${config.port}`);
});