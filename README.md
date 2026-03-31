# 🛸 Rick and Morty SOA - Microservicio Backend

Este repositorio contiene el código fuente del microservicio backend desarrollado como parte de una Arquitectura Orientada a Servicios (SOA). Su propósito principal es consumir la API pública de *Rick and Morty*, procesar la información y exponer endpoints seguros y tipados para que sean consumidos por un cliente frontend o un API Gateway.

##Características Principales

* **Consumo de API Externa:** Integración modular con la API de Rick and Morty a través de una capa de servicios dedicada.
* **Endpoints RESTful:** Rutas expuestas para obtener listas de personajes y detalles por ID, además de un endpoint de estado (`/health`).
* **Seguridad y Middleware:** Implementación de validaciones y directivas de seguridad para interceptar y proteger las peticiones entrantes.
* **Tipado Estricto:** Uso intensivo de TypeScript con interfaces definidas para mapear las respuestas de la API externa y garantizar la consistencia de los datos.

## 🛠️ Stack Tecnológico

* **Framework:** [Next.js](https://nextjs.org/) (Utilizado como servidor Node.js mediante sus *API Routes* en el App Router).
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **Entorno:** Node.js

##  Estructura del Proyecto

El código fuente está centralizado en la carpeta `src/`, separando claramente las responsabilidades:

```text
├── src/
│   ├── app/api/           # Controladores y definición de endpoints (Rutas)
│   │   ├── characters/    # Endpoint para listar todos los personajes
│   │   │   └── [id]/      # Endpoint para buscar un personaje específico
│   │   └── health/        # Endpoint de monitoreo de estado del servicio
│   ├── config/            # Variables de entorno y configuración global
│   ├── middleware/        # Lógica de interceptación (ej. security.ts)
│   ├── services/          # Lógica de negocio y peticiones HTTP externas (rickMortyService.ts)
│   └── types/             # Interfaces y tipos de datos (api.types.ts)
├── middleware.ts          # Punto de entrada del middleware de Next.js
