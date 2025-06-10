import express from "express";
import  upload  from "../middleWares/userUploadMW.js";
import { verifyToken } from "../middleWares/verifyToken.js";
import { userUpload } from '../models/Customers.js'
const router = express.Router();

router.post('/pic', verifyToken, upload.single('file'), userUpload );

export default router;