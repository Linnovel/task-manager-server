import { Router } from "express"
import { body, param } from "express-validator"
import { AuthController } from "../controllers/AuthController"
import { handleInputError } from "../middleware/validation"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("Name is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Contraseña muy corta debe ser minimo de 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden")
    }
    return true
  }),
  body("email").isEmail().withMessage("E-mail no valido"),
  handleInputError,
  AuthController.createAccount
)

router.post(
  "/confirm-account",

  body("token").notEmpty().withMessage("El token no puede ir vacio"),
  handleInputError,
  AuthController.confirmAccount
)

router.post(
  "/login",

  body("email").isEmail().withMessage("E-mail no valido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El Password no puede ir vacio"),
  handleInputError,
  AuthController.login
)

router.post(
  "/request-code",
  body("email").isEmail().withMessage("E-mail no valido"),
  handleInputError,
  AuthController.requestConfirmationCode
)

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("E-mail no valido"),
  handleInputError,
  AuthController.forgotPassword
)

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El token no puede ir vacio"),
  handleInputError,
  AuthController.validateToken
)

router.post(
  "/update-password/:token",
  param("token").isNumeric().withMessage("El token no valido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Contraseña muy corta debe ser minimo de 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden")
    }
    return true
  }),
  handleInputError,
  AuthController.updatePasswordWithToken
)

router.get("/user", authenticate, AuthController.user)

export default router
