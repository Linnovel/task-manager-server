import mongoose from "mongoose"
import colors from "colors"
import { exit } from "node:process"

export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.DATABASE_URL as string
    )
    const url = `${connection.connection.host}:${connection.connection.port}`
    console.log(
      colors.bgWhite.black(
        `Mongo se conecto correctamente en ${url}`
      )
    )
  } catch (error) {
    console.log(
      "Error al conectar a la base de datos",
      error
    )
    exit(1)
  }
}
