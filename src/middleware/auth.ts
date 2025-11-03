import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User, { IUser } from "../models/User"

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers.authorization
  if (!bearerHeader) {
    return res.status(401).json({ error: "No autorizado" })
  }

  const token = bearerHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "No autorizado" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    if (typeof decoded === "object" && "id" in decoded) {
      //Buscar el usuario por el id del token y agregarlo a la request y select solo trae los campos necesarios
      const user = await User.findById(decoded.id).select("_id name email")
      if (user) {
        req.user = user
        next()
      } else {
        return res.status(401).json({ error: "Token no valido" })
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Token No Valido" })
  }
}
