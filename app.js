import express from 'express';
import dotenv from 'dotenv';
import recipeRoutes from './Routes/recipe-Routes.js';
import userRoutes from './Routes/user_Routes.js';
import reviewRoutes from './Routes/review_Routes.js';
import ingredientRoutes from './Routes/ingredient_Routes.js';
import uploadRoutes from './Routes/uploadRoutes.js';
import  Cors  from 'cors';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

dotenv.config();
app.use(Cors());
app.use(helmet());
app.use(express.json());

const ip =process.env.Ip;
const PORT = process.env.PORT;


import('./config/server.cjs').then((module) => {
    const { connectDB } = module;
    connectDB();
}).catch((err) => {
    console.error('Failed to load server.cjs:', err);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/upload',uploadRoutes);

app.listen(PORT, () => {
    console.log(`Server running....`);
});
