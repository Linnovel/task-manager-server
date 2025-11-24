import { Router } from "express"
import { body, param } from "express-validator"
import { ProjectController } from "../controllers/ProjectController"
import { handleInputError } from "../middleware/validation"
import { TaskController } from "../controllers/TaskController"
import { validateProjectExist } from "../middleware/project"
import {
  hasAuthoration,
  taskBelongsToProject,
  taskExists,
} from "../middleware/task"
import { authenticate } from "../middleware/auth"
import { TeamMemberController } from "../controllers/TeamController"

const router = Router()

//Protege todas las rutas que esten debajo de este middleware
router.use(authenticate)

router.post(
  "/",

  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description").notEmpty().withMessage("La descripcion es obligatoria"),
  handleInputError,
  ProjectController.createProjects
)

router.get("/", ProjectController.getAllProjects)

router.get(
  "/:id",
  param("id").isMongoId().withMessage("Id no Valido"),
  handleInputError,
  ProjectController.getProjectById
)

//validar el ID y el Request
router.put(
  "/:id",
  param("id").isMongoId().withMessage("Id no Valido"),
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description").notEmpty().withMessage("La descripcion es obligatoria"),
  handleInputError,
  ProjectController.updateProject
)

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Id no Valido"),
  handleInputError,
  ProjectController.deleteProject
)

/* Routes para los Task*/
//Este router.param con el nombre del id y el middleware se encarga por si solo de validar
//el param y el id de las rutas. por eso se le quita el middleware a las demas.
router.param("projectId", validateProjectExist)

//Creacion de una tarea
router.post(
  "/:projectId/tasks",
  hasAuthoration,
  body("name").notEmpty().withMessage("El name de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripction de la tarea es obligatorio"),
  body("description").notEmpty().withMessage("La descripcion es obligatoria"),
  handleInputError,
  TaskController.createTask
)

//Traerse las tareas de un proyecto
router.get("/:projectId/tasks", TaskController.getProjectTaks)

router.param("taskId", taskExists)
router.param("taskId", taskBelongsToProject)

//Get proyectos y las tareas del proyecto
router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Id no Valido"),
  handleInputError,
  TaskController.getTaksById
)

router.put(
  "/:projectId/tasks/:taskId",
  hasAuthoration,
  param("taskId").isMongoId().withMessage("Id no Valido"),
  body("name").notEmpty().withMessage("El name de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripction de la tarea es obligatorio"),
  body("description").notEmpty().withMessage("La descripcion es obligatoria"),
  handleInputError,
  TaskController.updateTask
)

router.delete(
  "/:projectId/tasks/:taskId",
  hasAuthoration,
  param("taskId").isMongoId().withMessage("Id no Valido"),
  handleInputError,
  TaskController.deleteTask
)

router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("Id no Valido"),
  body("status").notEmpty().withMessage("El Estatus es obligatorio"),
  handleInputError,
  TaskController.updateStatusTask
)

/*  
Routes para los TEAMS. Manegar los usuarios que pertenecen a un proyecto
*/

//Buscar un miembro del equipo por su email
router.post(
  "/:projectId/team/find",
  body("email").isEmail().withMessage("Email no valido"),
  handleInputError,
  TeamMemberController.findMemberByEmail
)
//Agregar un miembro al equipo del proyecto
router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("Id de usuario no valido"),
  handleInputError,
  TeamMemberController.addTeamMemberById
)

//Obtener el equipo de un proyecto
router.get("/:projectId/team", TeamMemberController.getProjectTeam)

//Eliminar un miembro del equipo del proyecto
router.delete(
  "/:projectId/team/:userId",

  param("userId").isMongoId().withMessage("Id de usuario no valido"),
  handleInputError,
  TeamMemberController.deleteMemberById
)

export default router
