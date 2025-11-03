import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import { connectDb } from "./config/db"
import projectRoutes from "./routes/projectRoutes"
import authRoutes from "./routes/authRoutes"
import { corsConfig } from "./config/cors"

dotenv.config()

//Conexion a mongodb
connectDb()
//Servidor
const app = express()

app.use(cors(corsConfig))

//loggin
app.use(morgan("dev"))

//Lectura del formato
app.use(express.json())

//Routes
app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes)

export default app
