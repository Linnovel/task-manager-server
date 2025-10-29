import type { Request, Response, NextFunction } from "express"
import Project, { IProject } from "../models/Project"

//Esto es para poder pasar mediante el REQUEST como la informacion, algo asi en el TaskController
declare global {
  namespace Express {
    interface Request {
      project: IProject
    }
  }
}

export async function validateProjectExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { projectId } = req.params
    const project = await Project.findById(projectId).lean(false)
    console.log(project)
    if (!project) {
      const error = new Error("Proyecto no encontrado")
      return res.status(404).json({ error: error.message })
    }
    req.project = project
    next()
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Hubo u nerror" })
  }
}
