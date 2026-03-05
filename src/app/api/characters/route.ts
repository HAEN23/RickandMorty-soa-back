import { NextRequest, NextResponse } from 'next/server';
import { rickMortyApiService } from '@/services/rickMortyService';
import { 
  securityMiddleware, 
  sanitizeInput, 
  getSecurityResponseHeaders 
} from '@/middleware/security';


export async function GET(request: NextRequest) {
  
  const securityCheck = securityMiddleware(request);
  if (securityCheck) return securityCheck;

  try {
    const { searchParams } = new URL(request.url);
    
    
    const page = searchParams.get('page');
    const status = searchParams.get('status');
    const species = searchParams.get('species');
    const gender = searchParams.get('gender');
    const name = searchParams.get('name');

    
    if (name) {
      const sanitizedName = sanitizeInput(name);
      const character = await rickMortyApiService.getCharacterByName(sanitizedName);
      
      return NextResponse.json(
        {
          success: true,
          data: character,
        },
        {
          status: 200,
          headers: getSecurityResponseHeaders(),
        }
      );
    }

    
    const filters: any = {};
    if (page) filters.page = parseInt(page, 10);
    if (status) filters.status = sanitizeInput(status);
    if (species) filters.species = sanitizeInput(species);
    if (gender) filters.gender = sanitizeInput(gender);

   
    const result = await rickMortyApiService.getCharacters(filters);

    return NextResponse.json(
      {
        success: true,
        data: result.characters,
        pagination: result.info,
      },
      {
        status: 200,
        headers: getSecurityResponseHeaders(),
      }
    );
  } catch (error: any) {
    console.error('Error en GET /api/characters:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al obtener personajes',
        code: error.code || 'UNKNOWN_ERROR',
      },
      {
        status: error.status || 500,
        headers: getSecurityResponseHeaders(),
      }
    );
  }
}
