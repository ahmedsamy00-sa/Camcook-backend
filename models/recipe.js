import pkg from '../config/server.cjs';
const { sql } = pkg;

const getAllRecipes = async () => {
    const result = await sql.query(`
        SELECT 
            r.Recipe_id, r.Name, r.Image_url AS Recipe_Image, r.Video_link, r.Disc, r.Duration, r.Small_Disc,
            s.Step_id, s.Step_number, s.Instructions, s.Image_url AS Step_Image,
            i.Ingredient_id, i.Name AS Ingredient_Name, i.Price, i.Image_url AS Ingredient_Image,
            ri.Quantity
        FROM Recipes r 
        LEFT JOIN Recipe_Steps s ON r.Recipe_id = s.Recipe_id
        LEFT JOIN Recipe_Ingredients ri ON r.Recipe_id = ri.RE_id
        LEFT JOIN Ingredients i ON ri.ING_id = i.Ingredient_id
        ORDER BY r.Recipe_id, s.Step_number
    `);

    const recipeMap = new Map();

    result.recordset.forEach(row => {
        if (!recipeMap.has(row.Recipe_id)) {
            recipeMap.set(row.Recipe_id, {
                Recipe_id: row.Recipe_id,
                Name: row.Name,
                Image_url: row.Recipe_Image,
                Video_link: row.Video_link,
                Duration: row.Duration,
                Disc: row.Disc,
                Small_Disc: row.Small_Disc,
                Steps: [],
                Ingredients: []
            });
        }

        const recipe = recipeMap.get(row.Recipe_id);

        if (row.Step_id && !recipe.Steps.find(s => s.Step_id === row.Step_id)) {
            recipe.Steps.push({
                Step_id: row.Step_id,
                Step_number: row.Step_number,
                Instructions: row.Instructions,
                Image_url: row.Step_Image
            });
        }

        if (row.Ingredient_id && !recipe.Ingredients.find(i => i.Ingredient_id === row.Ingredient_id)) {
            recipe.Ingredients.push({
                Ingredient_id: row.Ingredient_id,
                Name: row.Ingredient_Name,
                Price: row.Price,
                Image_url: row.Ingredient_Image,
                Quantity: row.Quantity
            });
        }
    });

    return Array.from(recipeMap.values());
};



const getRecipeByName = async (Name) => {
    try {
        const result = await sql.query`SELECT * FROM Recipes WHERE Name = ${Name}`;
        
        if (result.recordset.length === 0) {
            return null; 
        }
        return result.recordset[0]; 
    } catch (err) { 
        console.error('Error fetching recipe by name:', err);
        throw new Error('Failed to fetch recipe');
    }
};

const searchRecipesByIngredient = async (ingredientName) => {
    try {        
        const result = await sql.query`
            SELECT 
                R.Recipe_id,
                R.Name AS Recipe_Name,
                R.Image_url,
                R.Video_link,
                R.Duration,
                R.Disc,
                R.Small_Disc
            FROM 
                Recipes R
            JOIN 
                Recipe_Ingredients RI ON R.Recipe_id = RI.RE_id
            JOIN 
                Ingredients I ON RI.ING_id = I.Ingredient_id
            WHERE 
                I.Name LIKE ${'%' + ingredientName + '%'}
        `;
        
        return result.recordset;
    } catch (err) {
        console.error('Database query error:', err.message);
        throw new Error(err.message);
    }
};


export { getAllRecipes, getRecipeByName, searchRecipesByIngredient };