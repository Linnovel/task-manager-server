import { Router } from "express"
import { body, param } from "express-validator"
import { ProjectController } from "../controllers/ProjectController"
import { handleInputError } from "../middleware/validation"
import { TaskController } from "../controllers/TaskController"
import { validateProjectExist } from "../middleware/project"
import { taskBelongsToProject, taskExists } from "../middleware/task"

const router = Router()

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

export default router
