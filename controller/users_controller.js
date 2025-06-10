import e from "express";
import { findUser, createUser, deleteUser, updateUser, logIn, userUpload} from "../models/Customers.js";
import {validationResult} from "express-validator";
import jwt from 'jsonwebtoken';


const logInHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success:false , errors: errors.array() });
    }
    const { email, password } = req.body; 
    try {
        const user = await logIn(email, password); 
        if (!user.success) {
            return res.status(401).json({ success : false , message: 'Invalid Email or Password' });
        }
        const token = jwt.sign({ customerId: user.CustomerId, Email:user.Email },process.env.jwt_secret_key);
        res.header("x-auth-token", token).status(200).json({
            user: {
                CustomerId: user.CustomerId,
                Username: user.Username,
                Email: user.Email,
                img: user.img,
                phone: user.phone,
                birthdate: user.birthdate,
                gender: user.gender,
            },
            message: 'Logged in successfully',
            token: token,
            success: true,
        });
    } catch (err) {
        res.status(500).json({success:false , message: err.message });
    }
};

const createUserHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false ,errors: errors.array() });
    }
    const { username, email, password,confirmPass, gender, birthdate, phone, img } = req.body;
    try {
        const existingUser = await findUser(email);
        if (existingUser) {
            return res.status(400).json({ success:false, message: 'User with this email already exists' });
        }
        if (password !== confirmPass) {
            return res.status(400).json({ success:false, message: 'Passwords do not match' });
        }

        const { user } = await createUser(username, email, password, phone, birthdate, gender, img);
        const token = jwt.sign({ customerId: user.CustomerId, Email:user.Email }, process.env.jwt_secret_key);

        res.header("x-auth-token", token).status(200).json({
            user: {
                CustomerId: user.CustomerId,
                Username: user.Username,
                Email: user.Email,
                img: user.img,
                phone: user.phone,
                birthdate: user.birthdate,
                gender: user.gender,
            },
            message: 'User created successfully',
            token: token,
            success: true,
        });
    } catch (err) {
        console.error('Error in createUserHandler:', err);
        res.status(500).json({ success: false ,message: err.message });
    }
};

const deleteUserHandler = async (req, res) => {
    const email = req.user.Email;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success:false ,errors: errors.array() });
    }
    try {
        const existingUser = await findUser(email);
        if (!existingUser) {
            return res.status(404).json({ success: false ,message: 'WRONG Email' });
        }

        const result = await deleteUser(email);
        res.json({ success: true , message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ success:false , message: err.message });
    }
};


const updateUserHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false , errors: errors.array() });
    }
    
    const { username, email, password, gender, birthdate, phone, img } = req.body;
    
    try {
        const existingUser = await findUser(email);
        if (!existingUser) {
            return res.status(404).json({ success: false , message: 'User not found' });
        }

        const updatedUser = await updateUser({ username, email, password, phone, birthdate, gender, img });
        
        const token = jwt.sign({ 
                customerId: updatedUser.Customers_id, 
                email: updatedUser.Email 
            },
            process.env.Updated_secret_key,);
        console.log('Token:', token);
        res.status(200).json({
            message: 'User updated successfully',
            newToken: token,
            success: true,
            user: {
                customerId: updatedUser.Customers_id,
                username: updatedUser.Name,
                email: updatedUser.Email,
                gender: updatedUser.Gender,
                phone: updatedUser.Phone_num,
                birthdate: updatedUser.Birthdate,
                img: updatedUser.Profile_IMG
            }
        });
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ 
            success: false,
            message: err.message || 'Internal server error' 
        });
    }
};

const userUploadHandler = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                error: 'No file uploaded' 
            });
        }

        const fileUrl = `../uploads/images${req.file.filename}`;

        res.status(200).json({ 
            success: true,
            message: 'File uploaded successfully',
            data: {
                filename: req.file.filename,
                url: fileUrl,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

export { logInHandler, createUserHandler, deleteUserHandler, updateUserHandler, userUploadHandler };
