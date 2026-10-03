# API de autenticación con Express y MongoDB

Implementación de la parte de procedimiento del laboratorio 07: autenticación con JWT, autorización por roles y persistencia en MongoDB.

## Requisitos

- Node.js 18 o superior
- MongoDB local o una URI de MongoDB accesible

## Instalación

1. Ejecuta npm install.
2. Copia .env.example como .env.
3. Configura MONGODB_URI y reemplaza JWT_SECRET en .env.

## Ejecución

Ejecuta npm run dev.

El servidor inicia en http://localhost:3000 por defecto.

## Endpoints

- GET /health: verifica que el servidor esté activo.
- POST /api/auth/signUp: registra un usuario con el rol user por defecto.
- POST /api/auth/signIn: devuelve un token JWT.
- GET /api/users/me: devuelve el usuario autenticado. Requiere Authorization: Bearer token.
- GET /api/users: lista usuarios. Requiere un token con el rol admin.

La sección de frontend indicada como TAREA no forma parte de esta entrega.
