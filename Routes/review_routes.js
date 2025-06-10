import { postReviewHandler, getAverageRatingsHandler, getTopRatedRecipesHandler } from "../controller/review_controller.js";
import express from "express";

const router = express.Router();

router.post('/addRate', postReviewHandler);
router.get('/avrRatings', getAverageRatingsHandler);
router.get('/topRatedRecipes', getTopRatedRecipesHandler);

export default router;
