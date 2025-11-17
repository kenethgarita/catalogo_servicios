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
    trustServerCertificate: true,
  },
};

export async function connectDB() {
  try {
    const pool = await sql.connect(dbSettings);
    console.log("Conexión a SQL Server exitosa");
    return pool;
  } catch (error) {
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
        `);

    //Tabla Categoria
    await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Categoria' AND xtype='U')
            CREATE TABLE Categoria (
                id_categoria INT IDENTITY(1,1) PRIMARY KEY,
                nombre_categoria VARCHAR(30)
            );
        `);

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
    await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.columns 
                   WHERE object_id = OBJECT_ID('Usuario') 
                   AND name = 'twofa_secret')
    BEGIN
        ALTER TABLE Usuario ADD twofa_secret NVARCHAR(MAX) NULL;
        ALTER TABLE Usuario ADD twofa_enabled BIT DEFAULT 0;
        ALTER TABLE Usuario ADD twofa_backup_codes NVARCHAR(MAX) NULL;
    END
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
    activo BIT DEFAULT 1,
    id_categoria INT FOREIGN KEY REFERENCES Categoria(id_categoria),
    
    -- Campos para almacenar archivos como BLOB
    imagen_blob VARBINARY(MAX),
    imagen_tipo VARCHAR(50),
    imagen_nombre VARCHAR(255),
    
    documentacion_blob VARBINARY(MAX),
    documentacion_tipo VARCHAR(50),
    documentacion_nombre VARCHAR(255),
    
    -- Mantener URLs como backup/alternativa
    imagen_servicio NVARCHAR(255),
    documentacion_url NVARCHAR(255)
);
        `);

    // Tabla Solicitud
    await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Solicitud' AND xtype='U')
    CREATE TABLE Solicitud (
        id_solicitud INT IDENTITY(1,1) PRIMARY KEY,
        id_usuario INT NOT NULL FOREIGN KEY REFERENCES Usuario(id_usuario),
        detalles_solicitud NVARCHAR(MAX),
        fecha_solicitud DATETIME DEFAULT GETDATE(),
        id_estado INT NOT NULL FOREIGN KEY REFERENCES Estado(id_estado),
        aceptada BIT NOT NULL DEFAULT 0,
        id_responsable_acepta INT NULL FOREIGN KEY REFERENCES Usuario(id_usuario)
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
