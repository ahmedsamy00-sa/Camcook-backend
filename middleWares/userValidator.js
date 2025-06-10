import { body , validationResult } from 'express-validator';

const validateLogin = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain a number')
];

const validateCreateUser = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain a number'),
    body('phone').isMobilePhone().withMessage("Invalid phone number"),
    //body('birthdate').isDate().withMessage("Invalid date"),
    body('gender').isIn(['male','female']).withMessage("Male or female only")
];

const validateDeleteUser = [
    body('email').isEmail().withMessage('Invalid email format')
];

const validateUpdateUser = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain a number'),
    body('phone').isMobilePhone().withMessage("Invalid phone number"),
    //body('birthdate').isDate().withMessage("Invalid date"),
    body('gender').isIn(['male','female']).withMessage("Male or female only")
];

const handleValidateError = (req,res,nxt)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    nxt();
}

export { validateLogin, validateCreateUser, validateDeleteUser, validateUpdateUser , handleValidateError };