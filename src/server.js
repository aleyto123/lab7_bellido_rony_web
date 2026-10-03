import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import seedRoles from './utils/seedRoles.js';

dotenv.config();

const requiredEnvironment = ['MONGODB_URI', 'JWT_SECRET'];
for (const variable of requiredEnvironment) {
  if (!process.env[variable]) {
    throw new Error('Falta la variable de entorno ' + variable);
  }
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || 'Error interno del servidor'
  });
});

async function startServer() {
  await mongoose.connect(process.env.MONGODB_URI, { autoIndex: true });
  await seedRoles();
  app.listen(port, () => console.log('Servidor corriendo en el puerto ' + port));
}

startServer().catch((error) => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});
