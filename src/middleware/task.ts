import type { Request, Response, NextFunction } from "express"
import Project, { ITask } from "../models/Task"

//Esto es para poder pasar mediante el REQUEST como la informacion, algo asi en el TaskController
declare global {
  namespace Express {
    interface Request {
      tasks: ITask
    }
  }
}

export async function taskExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { taskId } = req.params
    const task = await Project.findById(taskId)

    if (!task) {
      const error = new Error("Tarea no encontrado")
      return res.status(404).json({ error: error.message })
    }
    req.tasks = task
    next()
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Hubo u nerror" })
  }
}

export function taskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.tasks.project.toString() !== req.project.id.toString()) {
    const error = new Error("Accion no permitida")
    return res.status(400).json({ error: error.message })
  }
  next()
}

export function hasAuthoration(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req?.user?.id.toString() !== req?.project?.manager?.toString()) {
    const error = new Error("Accion no permitida")
    return res.status(400).json({ error: error.message })
  }

  next()
}
