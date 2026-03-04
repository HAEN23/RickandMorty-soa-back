import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import pokemonRoutes from './routes/rickMortyRoutes';

const app = express();

app.use(express.json());

app.use(cors()); 

app.use(pokemonRoutes);

app.listen(config.port, () => {
  console.log(` Microservicio PokeAPI conectado y escuchando en http://localhost:${config.port}`);
});