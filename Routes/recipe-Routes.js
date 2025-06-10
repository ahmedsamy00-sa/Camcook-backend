import express from 'express';
import { getAllRecipesHandler, getRecipeByNameHandler, searchRecipesByIngredientHandler } from '../controller/recipe-controller.js';

const router = express.Router();

router.get('/', getAllRecipesHandler);

router.get('/search', getRecipeByNameHandler);

router.get('/findRE', searchRecipesByIngredientHandler);

export default router;