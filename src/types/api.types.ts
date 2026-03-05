
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}


export interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
  status: number;
}

export interface CharacterQueryParams {
  page?: number;
  status?: 'alive' | 'dead' | 'unknown';
  species?: string;
  gender?: 'female' | 'male' | 'genderless' | 'unknown';
  name?: string;
}


export interface Config {
  port: number;
  nodeEnv: string;
  rickAndMortyApiUrl: string;
  apiTimeout: number;
  allowedOrigins: string[];
  rateLimitWindow: number;
  rateLimitMaxRequests: number;
}
