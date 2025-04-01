import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger.js';
import catRoutes from './routes/catRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import adopterRoutes from './routes/adopterRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());

// Enable trust proxy
app.set('trust proxy', 1);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(specs);
});

app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to Cat Café API',
    endpoints: {
      docs: '/api-docs',
      swagger_json: '/swagger.json',
      auth: '/api/auth',
      cats: '/api/cats',
      staff: '/api/staff', //protected
      adopters: '/api/adopters',
    },
  });
});

app.use('/api', authRoutes);
app.use('/api', catRoutes);
app.use('/api', adopterRoutes);
app.use('/api', authenticateToken, staffRoutes);

app.listen(port, () => {
  console.log(`🐱 Cat Café API is running at http://localhost:${port}`);
  console.log(`📜 API documentation available at http://localhost:${port}/api-docs`);
  console.log(`📄 Swagger JSON available at http://localhost:${port}/swagger.json`);
});