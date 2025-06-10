import pkg from '../config/server.cjs';
const { sql } = pkg;

const postReview = async (RE_id, rate) => {
    if (!RE_id || typeof rate !== "number" || rate < 1 || rate > 5) {
        throw new Error("Invalid input: RE_id must be provided, and rate must be a number between 1 and 5.");
    }
    try {
        await sql.query`
            INSERT INTO Reviews (RE_id, Rating)
            VALUES (${RE_id}, ${rate})
        `;
        return { message: "Rating added successfully" };
    } catch (err) {
        console.error('Database query error:', err);
        throw new Error("Failed to add rating");
    }
};

const getAverageRatings = async () => {
    try {
        const result = await sql.query`
            SELECT 
                R.Recipe_id,
                R.Name AS Recipe_Name,
                COALESCE(AVG(CAST(RV.Rating AS DECIMAL(10,2))), 0) AS Average_Rating
            FROM Recipes R
            LEFT JOIN Reviews RV ON R.Recipe_id = RV.RE_id
            GROUP BY R.Recipe_id, R.Name
        `;
        return result.recordset;
    } catch (err) {
        console.error("Error fetching average ratings:", err);
        throw new Error("Failed to fetch average ratings");
    }
};

const getTopRatedRecipes = async () => {
    try {
        const result = await sql.query`
            SELECT 
                R.Recipe_id,
                R.Name AS Recipe_Name,
                COALESCE(AVG(CAST(RV.Rating AS DECIMAL(10,2))), 0) AS Average_Rating
            FROM Recipes R
            LEFT JOIN Reviews RV ON R.Recipe_id = RV.RE_id
            GROUP BY R.Recipe_id, R.Name
            ORDER BY Average_Rating DESC
        `;
        return result.recordset;
    } catch (err) {
        console.error("Error fetching top-rated recipes:", err);
        throw new Error("Failed to fetch top-rated recipes");
    }
};

export { postReview, getAverageRatings, getTopRatedRecipes };
