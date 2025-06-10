import { getAllIngredients, getRecipeIngredients} from "../models/Ingredient.js";

const getIngredientsHandler = async (req, res) => {
    try {
        const ingredients = await getAllIngredients();
        res.json(ingredients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getRecipeIngredientsHandler = async (req, res) => {
    const { recipeId } = req.query;
    console.log(recipeId);
    try {
        const ingredients = await getRecipeIngredients(recipeId);
        if (!ingredients || ingredients.length === 0) {
            return res.status(404).json({ message: 'No ingredients found for the specified recipe' });
        }
        res.json(ingredients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export { getIngredientsHandler, getRecipeIngredientsHandler };