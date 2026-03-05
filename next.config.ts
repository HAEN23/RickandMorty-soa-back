import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para API Backend
  
  // Habilitar compresión
  compress: true,
  
  // Deshabilitar generación de páginas estáticas innecesarias
  output: 'standalone',
  
  // Headers de seguridad globales
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
  
  // Rewrites para proxy de API externa (si es necesario)
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
