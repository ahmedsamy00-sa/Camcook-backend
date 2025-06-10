import { getAllRecipes, getRecipeByName, searchRecipesByIngredient } from '../models/recipe.js';

const getAllRecipesHandler = async (req, res) => {
    try {
        const recipes = await getAllRecipes();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getRecipeByNameHandler = async (req, res) => {
    const { name } = req.query;
    try {
        const recipe = await getRecipeByName(name);
        if(!name || typeof name !== 'string') {
            return res.status(400).json({ message: 'Recipe name is required and must be a string' });
        }
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const searchRecipesByIngredientHandler = async (req, res) => {
    try {
        const ingredientName = req.query;

        if (!ingredientName || typeof ingredientName !== 'string') {
            return res.status(400).json({ message: 'Ingredient name is required and must be a string' });
        }

        const recipes = await searchRecipesByIngredient(ingredientName);

        if (!recipes || recipes.length === 0) {
            return res.status(404).json({ message: 'No recipes found for the specified ingredient' });
        }

        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



export { getAllRecipesHandler, getRecipeByNameHandler, searchRecipesByIngredientHandler };