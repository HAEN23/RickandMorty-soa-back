import axios, { AxiosError } from 'axios';
import { config } from '../config/env';


interface RickMortyCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}


interface RickMortyApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: RickMortyCharacter[];
}


export interface CleanedCharacterData {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  origin: string;
  location: string;
}


export interface ApiError {
  message: string;
  status: number;
  code?: string;
}


class RickMortyApiService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = config.rickAndMortyApiUrl;
    this.timeout = config.apiTimeout;
  }

 
  async getCharacterByName(name: string): Promise<CleanedCharacterData> {
    try {
      const response = await axios.get<RickMortyApiResponse>(
        `${this.baseUrl}`,
        {
          params: { name },
          timeout: this.timeout,
          headers: {
            'User-Agent': 'RickMorty-Proxy-Service/1.0',
          },
        }
      );

      if (!response.data.results || response.data.results.length === 0) {
        throw this.createError('Personaje no encontrado', 404, 'NOT_FOUND');
      }

      const character = response.data.results[0];
      return this.cleanCharacterData(character);
    } catch (error) {
      throw this.handleApiError(error);
    }
  }


  async getCharacterById(id: number): Promise<CleanedCharacterData> {
    try {
      const response = await axios.get<RickMortyCharacter>(
        `${this.baseUrl}/${id}`,
        {
          timeout: this.timeout,
          headers: {
            'User-Agent': 'RickMorty-Proxy-Service/1.0',
          },
        }
      );

      return this.cleanCharacterData(response.data);
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  
  async getCharacters(filters: {
    page?: number;
    status?: string;
    species?: string;
    gender?: string;
  } = {}): Promise<{
    characters: CleanedCharacterData[];
    info: {
      count: number;
      pages: number;
      next: number | null;
      prev: number | null;
    };
  }> {
    try {
      const response = await axios.get<RickMortyApiResponse>(
        `${this.baseUrl}`,
        {
          params: filters,
          timeout: this.timeout,
          headers: {
            'User-Agent': 'RickMorty-Proxy-Service/1.0',
          },
        }
      );

      const cleanedCharacters = response.data.results.map((char) =>
        this.cleanCharacterData(char)
      );

      // Extraer número de página de URLs next/prev
      const getPageNumber = (url: string | null): number | null => {
        if (!url) return null;
        const match = url.match(/page=(\d+)/);
        return match ? parseInt(match[1], 10) : null;
      };

      return {
        characters: cleanedCharacters,
        info: {
          count: response.data.info.count,
          pages: response.data.info.pages,
          next: getPageNumber(response.data.info.next),
          prev: getPageNumber(response.data.info.prev),
        },
      };
    } catch (error) {
      throw this.handleApiError(error);
    }
  }


  private cleanCharacterData(rawData: RickMortyCharacter): CleanedCharacterData {
    return {
      id: rawData.id,
      name: rawData.name,
      status: rawData.status,
      species: rawData.species,
      image: rawData.image,
      origin: rawData.origin.name,
      location: rawData.location.name,
    };
  }

  
  private handleApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
       
        return this.createError(
          `Error de API externa: ${axiosError.response.statusText}`,
          axiosError.response.status,
          'EXTERNAL_API_ERROR'
        );
      } else if (axiosError.request) {
       
        return this.createError(
          'No se pudo conectar con la API externa',
          503,
          'SERVICE_UNAVAILABLE'
        );
      }
    }

    return this.createError(
      'Error interno del servidor',
      500,
      'INTERNAL_ERROR'
    );
  }

 
  private createError(message: string, status: number, code: string): ApiError {
    return { message, status, code };
  }

 
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/1`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}


export const rickMortyApiService = new RickMortyApiService();
