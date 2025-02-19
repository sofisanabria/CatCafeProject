import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger.js';
import catRoutes from './routes/catRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import adopterRoutes from './routes/adopterRoutes.js';

const app = express();
const port = 3000;

app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Add root route
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to Cat Café API',
    endpoints: {
      docs: '/api-docs',
      cats: '/api/cats',
      staff: '/api/staff',
      adopters: '/api/adopters'
    }
  });
});

app.use('/api', catRoutes);
app.use('/api', staffRoutes);
app.use('/api', adopterRoutes);

app.listen(port, () => {
  console.log(`Cat Café API is running at http://localhost:${port}`);
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
});