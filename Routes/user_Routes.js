import { logInHandler , createUserHandler,deleteUserHandler,updateUserHandler } from "../controller/users_controller.js";
import {validateLogin, validateCreateUser, validateDeleteUser , validateUpdateUser, handleValidateError} from "../middleWares/userValidator.js";
import { Authorize,verifyToken } from "../middleWares/verifyToken.js";
import express from "express";


const router = express.Router();

router.post('/login',validateLogin,handleValidateError, logInHandler);

router.post('/register',validateCreateUser,handleValidateError, createUserHandler);

router.delete('/remove/:id',verifyToken,Authorize, deleteUserHandler);

router.put('/update/:id',verifyToken,Authorize,validateUpdateUser,handleValidateError, updateUserHandler);

export default router;