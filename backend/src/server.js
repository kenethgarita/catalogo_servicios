import express from "express";
import { connectDB, InitDB } from "./config/db.js";

import Usuarios from "./routes/userRoutes.js"
import Roles from "./routes/rolRoutes.js"
import Categorias from "./routes/categoriaRoutes.js"
import Servicios from "./routes/ServicioRoutes.js"
import Solicitudes from "./routes/solicitudRoutes.js"
import solicitudServicio from "./routes/solicitudServicioRoutes.js"
import Responsables from "./routes/responsableRoutes.js"
import Estado from "./routes/estadoRoutes.js"

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use("/Roles",Roles)
app.use("/Categorias",Categorias)
app.use("/Servicio",Servicios)
app.use("/Solicitudes",Solicitudes)
app.use("/SolicitudServicios",solicitudServicio)
app.use("/Responsables",Responsables)
app.use("/Estado",Estado)

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
