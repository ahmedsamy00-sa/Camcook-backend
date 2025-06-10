const sql = require("mssql");
require('dotenv').config();

const config = {
    user: process.env.DB_user,
    password: process.env.DB_password,
    server: process.env.DB_server,
    database: process.env.DB_name,
    options: {  
        trustedConnection: false,
        enableArithAbort: true,
        encrypt: true,  
        trustServerCertificate: true,  
        cryptoCredentialsDetails: {
            minVersion: "TLSv1.2" 
        }
    },
    port: Number(process.env.DB_port),
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log("Database connected!");
    } catch (err) {
        console.log("Database Connection Error:", err);
    }
};

module.exports = { connectDB, sql };