import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const dbSettings = {    
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,     
  database: process.env.DB_DATABASE,   
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

export async function connectDB() {
    try{
        const pool = await sql.connect(dbSettings);
        console.log("Conexión a SQL Server exitosa");
        return pool;
    } catch(error){
        console.error("Error al conectar a la base de datos:", error);
    }
}

export async function InitDB() {
    try {
        const pool = await connectDB();

        //Tabla Estado
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Estado' AND xtype='U')
            CREATE TABLE Estado (
                id_estado INT IDENTITY(1,1) PRIMARY KEY,
                nombre_estado VARCHAR(30)
            );
        `)

        //Tabla Categoria
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Categoria' AND xtype='U')
            CREATE TABLE Categoria (
                id_categoria INT IDENTITY(1,1) PRIMARY KEY,
                nombre_categoria VARCHAR(30)
            );
        `)

        //Tabla Rol
         await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Rol' AND xtype='U')
            CREATE TABLE Rol (
                id_rol INT IDENTITY(1,1) PRIMARY KEY,
                nombre_rol VARCHAR(30)
            );
        `);

        // Tabla Usuario
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Usuario' AND xtype='U')
            CREATE TABLE Usuario (
                id_usuario INT IDENTITY(1,1) PRIMARY KEY,
                nombre VARCHAR(100),
                apellido1 VARCHAR(100),
                apellido2 VARCHAR(100),
                cargo VARCHAR(100),
                municipalidad VARCHAR(100),
                correo VARCHAR(100) UNIQUE NOT NULL,
                contrasena NVARCHAR(MAX) NOT NULL,
                num_tel VARCHAR(20),
                id_rol INT FOREIGN KEY REFERENCES Rol(id_rol)
            );
        `);

        // Tabla Servicio
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Servicio' AND xtype='U')
            CREATE TABLE Servicio (
                id_servicio INT IDENTITY(1,1) PRIMARY KEY,
                nombre_servicio VARCHAR(100),
                descripcion_servicio VARCHAR(300),
                proposito_servicio VARCHAR(150),
                area_responsable VARCHAR(100),
                tiempo VARCHAR(50),
                documentacion_url NVARCHAR(255),
                imagen_servicio NVARCHAR(255),
                activo BIT DEFAULT 1,
                id_categoria INT FOREIGN KEY REFERENCES Categoria(id_categoria)
            );
        `);

        // Tabla Solicitud
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Solicitud' AND xtype='U')
            CREATE TABLE Solicitud (
                id_solicitud INT IDENTITY(1,1) PRIMARY KEY,
                id_usuario INT FOREIGN KEY REFERENCES Usuario(id_usuario),
                detalles_solicitud NVARCHAR(MAX),
                estado_solicitud VARCHAR(20),
                fecha_solicitud DATETIME DEFAULT GETDATE(),
                id_estado INT FOREIGN KEY REFERENCES Estado(id_estado)
            );
        `);

        // Tabla Solicitud_servicio
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Solicitud_servicio' AND xtype='U')
            CREATE TABLE Solicitud_servicio (
                id_solicitud_servicio INT IDENTITY(1,1) PRIMARY KEY,
                id_solicitud INT FOREIGN KEY REFERENCES Solicitud(id_solicitud),
                id_servicio INT FOREIGN KEY REFERENCES Servicio(id_servicio)
            );
        `);

        // Tabla Responsable
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Responsable' AND xtype='U')
            CREATE TABLE Responsable (
                id_responsable INT IDENTITY(1,1) PRIMARY KEY,
                id_usuario INT FOREIGN KEY REFERENCES Usuario(id_usuario),
                id_servicio INT FOREIGN KEY REFERENCES Servicio(id_servicio)
            );
        `);

        console.log("Todas las tablas fueron creadas o ya existían correctamente.");
    } catch (error) {
        console.error("Error creando las tablas:", error);
    }
}
