import jwt from "jsonwebtoken"
import Types from "mongoose"

type UserPayload = {
  id: Types.ObjectId | string
}

export const generateJWT = (payload: UserPayload) => {
  const secret = process.env.JWT_SECRET as string
  //expiresIn se encarga de definir el tiempo de expiracion del token
  const token = jwt.sign(payload, secret, { expiresIn: "1d" })
  return token
}
