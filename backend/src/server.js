import express from "express";
import { connectDB, InitDB } from "./config/db.js";
import cors from "cors"

import Usuarios from "./routes/userRoutes.js"
import Roles from "./routes/rolRoutes.js"
import Categorias from "./routes/categoriaRoutes.js"
import Servicios from "./routes/ServicioRoutes.js"
import Solicitudes from "./routes/solicitudRoutes.js"
import solicitudServicio from "./routes/solicitudServicioRoutes.js"
import Responsables from "./routes/responsableRoutes.js"
import Estado from "./routes/estadoRoutes.js"
import Email from "./routes/emailRoutes.js"
import TwoFactor from "./routes/twoFactorRoutes.js"
import PasswordRoutes from "./routes/passwordRoutes.js";

import { authMiddleware } from "./middlewares/authmiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:3000", // dominio del frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

(async () => {
  await InitDB();
})();

app.get("/", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT GETDATE() AS fechaActual');
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// Routes
app.use("/Usuarios",Usuarios)
app.use("/Roles",authMiddleware, Roles)
app.use("/Categorias",authMiddleware, Categorias)
app.use("/Servicio",Servicios)
app.use("/Solicitudes",authMiddleware, Solicitudes)
app.use("/SolicitudServicios",authMiddleware, solicitudServicio)
app.use("/Responsables", authMiddleware, Responsables)
app.use("/Estado", authMiddleware, Estado)
app.use("/Email", authMiddleware, Email)
app.use("/TwoFactor",TwoFactor)
app.use("/Password", PasswordRoutes);

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
