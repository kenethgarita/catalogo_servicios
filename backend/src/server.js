import express from "express";
import { connectDB } from "./db.js"

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", async(req,res) => {
    const pool = await connectDB
    const result = await pool.request().query('SELECT GETDATE() as fechaActual');
  res.json(result.recordset);
})

app.listen(PORT,() => console.log(`Servidor corriendo en puerto ${PORT}`))