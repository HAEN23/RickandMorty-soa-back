import { NextRequest, NextResponse } from 'next/server';
import { rickMortyApiService } from '@/services/rickMortyService';
import { 
  securityMiddleware, 
  getSecurityResponseHeaders 
} from '@/middleware/security';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  
  const securityCheck = securityMiddleware(request);
  if (securityCheck) return securityCheck;

  try {
   
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);

    
    if (isNaN(id) || id < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID inválido. Debe ser un número positivo.',
          code: 'INVALID_ID',
        },
        {
          status: 400,
          headers: getSecurityResponseHeaders(),
        }
      );
    }

    
    const character = await rickMortyApiService.getCharacterById(id);

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
  } catch (error: any) {
    
    const { id: idParam } = await params;
    console.error(`Error en GET /api/characters/${idParam}:`, error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al obtener personaje',
        code: error.code || 'UNKNOWN_ERROR',
      },
      {
        status: error.status || 500,
        headers: getSecurityResponseHeaders(),
      }
    );
  }
}
