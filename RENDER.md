# Despliegue del laboratorio 07 en Render

Crear un nuevo Web Service desde aleyto123/lab7_bellido_rony_web.

- Name: express-auth-bellido (o un sufijo si el nombre está ocupado).
- Language: Node.
- Branch: main.
- Root Directory: vacío.
- Build Command: npm ci.
- Start Command: npm start.
- Instance Type: Free.
- Health Check Path: /health.

Variables de entorno:

| Nombre | Valor |
| --- | --- |
| MONGODB_URI | URI real de Atlas, con base auth_db. No usar localhost. |
| JWT_SECRET | Secreto largo aleatorio, generado con Generate en Render. |
| JWT_EXPIRES_IN | 1h |
| BCRYPT_SALT_ROUNDS | 10 |
| NODE_ENV | production |

Render proporciona PORT automáticamente. No confundir MONGODB_URI con MONGO_URI del ejemplo CRUD.

Para CI/CD, copiar el Deploy Hook de ESTE servicio y guardarlo en ESTE repositorio como secret RENDER_DEPLOY_HOOK_URL. El hook del servicio CRUD publica el proyecto anterior y no corresponde a este API.

En Render, poner Auto-Deploy en Off para que el workflow valide antes de publicar. Ejecutar el workflow desde GitHub Actions o hacer push a main. Confirmar después que Render termine Live con el mismo commit.

## Pruebas y evidencias

1. GET BASE_URL/health: 200, {"ok":true}. Usar esta ruta para la captura del navegador.
2. POST BASE_URL/api/auth/signUp, Body raw JSON:
   {"name":"Rony prueba JWT","email":"rony-jwt-prueba@example.com","password":"UnaClaveDePrueba123!"}
   Esperado: 201; usar un correo nuevo si ya existe.
3. POST BASE_URL/api/auth/signIn con el mismo email y password. Esperado: 200 y token.
4. GET BASE_URL/api/users/me, Authorization > Bearer Token > token devuelto. Esperado: 200.
5. GET BASE_URL/api/users/me sin token. Esperado: 401.
6. GET BASE_URL/api/users con token de user. Esperado: 403, porque requiere admin.
7. Capturar auth_db y sus colecciones users y roles desde Compass, ocultando hashes y credenciales.
8. Capturar GitHub Actions en verde y el despliegue Live del mismo commit en Render.

El registro público siempre asigna el rol user. No permite crear administradores desde el body.

No publicar .env, JWT_SECRET, Deploy Hook ni tokens reales en evidencias.
