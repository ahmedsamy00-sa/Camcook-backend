import pkg from '../config/server.cjs';
import { hashPassword, comparePassword } from '../utils/hashPassword.js'; 
const { sql } = pkg;


const logIn = async (email, password) => {
    try {
        if (!email || !password) {
            return{ success: false , message:"Email and password are required"};
        }
        const result = await sql.query`SELECT Customers_id, Name,Gender,Phone_num,Birthdate, Email, Password AS passwordHash, Profile_IMG
        FROM Customers 
        WHERE Email = ${email}`;

        const user = result.recordset[0];
        if (!user || !(await comparePassword(password, user.passwordHash))) {
            return { success: false ,message:"Invalid credentials"};
        }
        return {
            success: true,
            CustomerId: user.Customers_id,
            Email: user.Email,
            Username: user.Name,
            img: user.Profile_IMG,
            phone: user.Phone_num,
            birthdate: user.Birthdate,
            gender: user.Gender,
        };
    } catch (err) {
        console.error('Error fetching user:', err);
        throw new Error('Failed to fetch user');
    }
};

const findUser = async (email) => {
    try {
        const result = await sql.query`SELECT Customers_id, Name, Gender,Phone_num,Birthdate, Email, Password AS passwordHash 
        FROM Customers 
        WHERE Email = ${email}`;
        const user = result.recordset[0];
        if (!user) {
            return null;
        }

        return {
            CustomerId: user.Customers_id,
            Username: user.Name,
            Email: user.Email,
        };
    } catch (err) {
        console.error('Error fetching user:', err);
        throw new Error('Failed to fetch user');
    }
};

const createUser = async (username, email, password, phone, birthdate, gender, img) => {
    try {
        const passwordHash = await hashPassword(password);

        const result = await sql.query`
            INSERT INTO Customers (Name, Gender, Phone_num, Birthdate, Email, Password, Profile_IMG)
            OUTPUT INSERTED.Customers_id, INSERTED.Name, INSERTED.Email, INSERTED.Profile_IMG , INSERTED.Phone_num, INSERTED.Birthdate, INSERTED.Gender
            VALUES (${username}, ${gender}, ${phone}, ${birthdate}, ${email}, ${passwordHash}, ${img});`;
        
        const user = result.recordset[0];
        return {
            message: 'User created successfully',
            user: {
                CustomerId: user.Customers_id,
                Username: user.Name,
                Email: user.Email,
                img: user.Profile_IMG,
                phone: user.Phone_num,
                birthdate: user.Birthdate,
                gender: user.Gender,
            }
        };
    } catch (err) {
        console.error('Error creating user:', err);
        throw new Error('Failed to create user: ' + err.message);
    }
};


const deleteUser = async (email) => {
    try {
        const userResult = await sql.query`SELECT * FROM Customers WHERE Email = ${email}`;
        if (!userResult.recordset[0]) {
            throw new Error('User not found');
        }

        await sql.query`DELETE FROM Customers WHERE Email = ${email}`;
        return { message: 'User deleted successfully' };
    } catch (err) {
        console.error('Error deleting user:', err);
        throw new Error('Failed to delete user');
    }
};

const updateUser = async (updateData) => {
    try {
        const userResult = await sql.query`SELECT * FROM Customers WHERE Email = ${updateData.email}`;
        if (!userResult.recordset[0]) {
            throw new Error('User not found');
        }

        const currentUser = userResult.recordset[0];
        
        const updatedFields = {
            Name: updateData.username || currentUser.Name,
            Gender: updateData.gender || currentUser.Gender,
            Phone_num: updateData.phone || currentUser.Phone_num,
            Birthdate: updateData.birthdate || currentUser.Birthdate,
            Profile_IMG: updateData.img || currentUser.Profile_IMG
        };

        if (updateData.password) {
            updatedFields.Password = await hashPassword(updateData.password);
        } else {
            updatedFields.Password = currentUser.Password;
        }

        await sql.query`
            UPDATE Customers
            SET Name = ${updatedFields.Name}, 
                Password = ${updatedFields.Password}, 
                Gender = ${updatedFields.Gender},
                Phone_num = ${updatedFields.Phone_num}, 
                Birthdate = ${updatedFields.Birthdate}, 
                Profile_IMG = ${updatedFields.Profile_IMG}
            WHERE Email = ${updateData.email}
        `;
        
        const refreshedUser = await sql.query`
            SELECT Customers_id, Name, Email, Gender, Phone_num, Birthdate, Profile_IMG
            FROM Customers 
            WHERE Email = ${updateData.email}
        `;
        
        return refreshedUser.recordset[0];
    } catch (err) {
        console.error('Error updating user:', err);
        throw new Error('Failed to update user');
    }
};


const userUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const CustomerId = req.user.customerId; 
        const filePath = `uploads/images/${req.file.filename}`;

        const updateResult = await sql.query`
            UPDATE Customers
            SET Profile_IMG = ${filePath}
            WHERE Customers_id = ${CustomerId}
        `;
        const result = await sql.query`
            SELECT Customers_id, Name, Email, Profile_IMG
            FROM Customers
            WHERE Customers_id = ${CustomerId}
        `;
        const user = result.recordset[0];
        res.status(200).json({
            message: "Image uploaded successfully",
            user: {
                CustomerId: user.Customers_id,
                Username: user.Name,
                Email: user.Email,
                img: user.Profile_IMG,
            }
        });

    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
export { findUser, createUser, deleteUser, updateUser, logIn , userUpload };