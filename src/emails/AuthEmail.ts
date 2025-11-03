import { transporter } from "../config/nodemailer"

interface IEmail {
  email: string
  name: string
  token: string
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    //enviar el E-mail
    const info = await transporter.sendMail({
      from: '"UpTask - Administrador de Proyectos" <admin@uptask.com>',
      to: user.email,
      subject: "UpTask - confirma tu cuenta",
      text: "UpTask - Confirma tu cuenta",
      html: `<p>Hola: ${user.name}, has creado tu cuenta en UpTask, solo debes confirmar tu cuenta</p>
      <p>Visita el siguiente enlace:</p>
      <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
      <p>E ingresa el codigo: <b>${user.token}</b></p>
      <p>Este token expira en 10 minutos</p>
      `,
    })
    console.log("Mensaje enviado", info)
  }

  static sendPasswordResetToken = async (user: IEmail) => {
    //enviar el E-mail
    const info = await transporter.sendMail({
      from: '"UpTask - Administrador de Proyectos" <admin@uptask.com>',
      to: user.email,
      subject: "UpTask - Reestablece tu password",
      text: "UpTask - Reestablece tu password",
      html: `<p>Hola: ${user.name}, has solicitado reestablecer tu password</p>
      <p>Visita el siguiente enlace:</p>
      <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablece tu contraseña</a>
      <p>E ingresa el codigo: <b>${user.token}</b></p>
      <p>Este token expira en 10 minutos</p>
      `,
    })
    console.log("Mensaje enviado", info)
  }
}
