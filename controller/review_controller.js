import { postReview, getAverageRatings, getTopRatedRecipes } from "../models/review.js";

const postReviewHandler = async (req, res) => {
    const { rate } = req.body; 
    const { recipeId } = req.query

    if (!recipeId || !rate || typeof rate !== "number" || rate < 1 || rate > 5) {
        return res.status(400).json({ message: "Invalid input: recipeId is required and rate must be a number between 1 and 5." });
    }

    try {
        await postReview(recipeId, rate);
        res.json({ message: "Rating added successfully" });
    } catch (err) {
        console.error("Error posting review:", err);
        res.status(500).json({ message: "Failed to add rating" });
    }
};

const getAverageRatingsHandler = async (req, res) => {
    try {
        const avr_RV = await getAverageRatings();
        res.json(avr_RV);
    } catch (err) {
        console.error("Error fetching average ratings:", err);
        res.status(500).json({ message: "Failed to fetch average ratings" });
    }
};

const getTopRatedRecipesHandler = async (req, res) => {
    try {
        const top_RV = await getTopRatedRecipes();
        res.json(top_RV);
    } catch (err) {
        console.error("Error fetching top-rated recipes:", err);
        res.status(500).json({ message: "Failed to fetch top-rated recipes" });
    }
};

export { postReviewHandler, getAverageRatingsHandler, getTopRatedRecipesHandler };
