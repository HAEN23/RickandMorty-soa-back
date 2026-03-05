import dotenv from 'dotenv';

dotenv.config();

export const config = {
  
  port: parseInt(process.env.PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  
  rickAndMortyApiUrl: process.env.RICKANDMORTYAPI_URL || 'https://rickandmortyapi.com/api/character',
  
  
  apiTimeout: parseInt(process.env.API_TIMEOUT || '10000', 10), 
  
  
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:3001'],
  

  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10), 
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
} as const;


export function validateConfig(): void {
  if (!config.rickAndMortyApiUrl) {
    throw new Error('RICKANDMORTYAPI_URL no está configurada');
  }
  
  if (config.port < 1 || config.port > 65535) {
    throw new Error('PORT debe estar entre 1 y 65535');
  }
  
  console.log(' Configuración validada correctamente');
}


if (config.nodeEnv !== 'test') {
  validateConfig();
}