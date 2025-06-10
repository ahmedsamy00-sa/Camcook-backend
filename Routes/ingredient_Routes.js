import{ getIngredientsHandler, getRecipeIngredientsHandler} from '../controller/ingredient_controller.js';
import  Express  from 'express';

const router = Express.Router();

router.get('/', getIngredientsHandler);
router.get('/search', getRecipeIngredientsHandler);

export default router;