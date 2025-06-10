import pkg from "../config/server.cjs";
const { sql } = pkg;

const getAllIngredients = async () => {
    const result = await sql.query(`
    SELECT * FROM Ingredients`);
    return result.recordset;
};

const getRecipeIngredients = async (recipeId) => {
    if (!recipeId) {
        throw new Error('Recipe ID is required');
    }
    try{
        const result = await sql.query`
        SELECT 
        i.Ingredient_id,
        i.Name, 
        ri.Quantity 
        FROM 
        Recipe_Ingredients ri
        JOIN Ingredients i ON ri.ING_id = i.Ingredient_id
        WHERE ri.RE_id = ${recipeId}
        `;
        return result.recordset;
    }
    catch (err) {
        console.error('Error fetching recipe ingredients:', err);
        throw new Error('Failed to fetch recipe ingredients');
    }
};

export { getAllIngredients, getRecipeIngredients };