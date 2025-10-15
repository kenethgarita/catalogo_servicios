import express from "express";
import { connectDB, InitDB } from "./config/db.js";

import Usuarios from "./routes/userRoutes.js"

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

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
