import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./config/db"
import projectRoutes from "./routes/projectRoutes"

dotenv.config()
//Conexion a mongodb
connectDb()
//Servidor
const app = express()

//Lectura del formato
app.use(express.json())

//Routes
app.use("/api/projects", projectRoutes)

export default app
