import { NextRequest, NextResponse } from 'next/server';
import { rickMortyApiService } from '@/services/rickMortyService';
import { getSecurityResponseHeaders } from '@/middleware/security';


export async function GET(request: NextRequest) {
  try {
    const isExternalApiHealthy = await rickMortyApiService.healthCheck();

    const healthStatus = {
      status: isExternalApiHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'rick-morty-proxy',
      externalApi: {
        name: 'Rick and Morty API',
        status: isExternalApiHealthy ? 'up' : 'down',
      },
    };

    return NextResponse.json(
      healthStatus,
      {
        status: isExternalApiHealthy ? 200 : 503,
        headers: getSecurityResponseHeaders(),
      }
    );
  } catch (error) {
    console.error('Error en health check:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'rick-morty-proxy',
        error: 'Error al verificar el estado del servicio',
      },
      {
        status: 500,
        headers: getSecurityResponseHeaders(),
      }
    );
  }
}
