import sql from "mssql";
import dotenv from "dotenv"

const dbSettings = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

export async function connectDB() {
    try{
        const pool = await sql.connect(dbSettings);
        console.log("Conexión a SQL Server exitosa");
        return pool;
    } catch(error){
        console.error("Error al conectar a la base de datos", error)
    }
}

