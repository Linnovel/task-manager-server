import { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { transporter } from "../config/nodemailer"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body
      //Prevenir duplicados
      const userExist = await User.findOne({ email })
      if (userExist) {
        return res.status(409).json({ error: "Ese usuario ya esta registrado" })
      }
      //Crea un nuevo usuario
      const user = new User(req.body)
      //Hash password antes de salvar el usuario
      user.password = await hashPassword(password)

      //Generar el token
      const token = new Token()
      token.token = generateToken()
      token.user = user.id

      //enviar el E-mail
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      })

      await Promise.allSettled([user.save(), token.save()])

      res.send("Cuenta creada , revisa tu email para confirmarlo")
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" })
    }
  }

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body

      const tokenExist = await Token.findOne({ token })

      if (!tokenExist) {
        const error = new Error("Token no valido")
        return res.status(404).json({ error: error.message })
      }

      const user = await User.findById(tokenExist.user)

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" })
      }

      user.confirmed = true

      await Promise.allSettled([user.save(), tokenExist.deleteOne()])
      res.send("Cuenta confirmada correctamente")
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" })
    }
  }

  static login = async (req: Request, res: Response) => {
    try {
      //lo que queremos buscar
      const { email, password } = req.body
      //Esto busca en nuestra base de datos al usuario por su email
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" })
      }

      if (!user.confirmed) {
        const token = new Token()
        token.user = user.id
        token.token = generateToken()
        await token.save()

        //enviar el E-mail
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        })

        return res.status(401).json({
          error:
            "Usuario no confirmado, hemos enviado un E-mail de confirmacion",
        })
      }

      //Revisar Password
      const isPasswordCorrect = await checkPassword(password, user.password)
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Password incorrecto" })
      }

      if (!user._id) {
        throw new Error("User ID is missing")
      }
      const token = generateJWT({ id: user._id.toString() })

      //Todo bien, iniciar sesion
      res.send(token)
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" })
    }
  }

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body

      //Usuario Existe
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({ error: "El usuario no esta registrado" })
      }

      if (user.confirmed) {
        return res
          .status(403)
          .json({ error: "El usuario ya ha sido confirmado" })
      }
      //Generar el token
      const token = new Token()
      token.token = generateToken()
      token.user = user.id

      //enviar el E-mail
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      })
      await Promise.allSettled([token.save(), user.save()])

      res.send("Revisa tu E-mail, se envio un nuevo codigo de confirmacion")
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" })
    }
  }

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body

      //Usuario Existe
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({ error: "El usuario no esta registrado" })
      }

      //Generar el token
      const token = new Token()
      token.token = generateToken()
      token.user = user.id
      await token.save()

      //enviar el E-mail
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      })

      res.send(
        "Revisa tu E-mail, y sigue las instrucciones para reestablecer tu password"
      )
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body

      const tokenExist = await Token.findOne({ token })

      if (!tokenExist) {
        const error = new Error("Token no valido")
        return res.status(404).json({ error: error.message })
      }

      res.send("Token valido, define tu nuevo password")
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" })
    }
  }

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params

      const tokenExist = await Token.findOne({ token })

      if (!tokenExist) {
        const error = new Error("Token no valido")
        return res.status(404).json({ error: error.message })
      }

      const user = await User.findById(tokenExist.user)

      if (!user?.password) {
        return res.status(404).json({ error: "Usuario no encontrado" })
      }

      user.password = await hashPassword(req.body.password)

      await Promise.allSettled([user.save(), tokenExist.deleteOne()])

      res.send("Token valido, define tu nuevo password")
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
  static user = async (req: Request, res: Response) => {
    return res.json(req.user)
  }
}
