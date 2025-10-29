import type { Request, Response } from "express"
import Project from "../models/Project"

//Revisar mañana el codigo de Juan con el tuyo

export class ProjectController {
  static createProjects = async (req: Request, res: Response) => {
    //Una forma de crear el projecto
    // const project = new Project(req.body)
    try {
      //   await project.save()

      //Segunda forma de crearlo mas concreta y rapida
      await Project.create(req.body)
      return res.status(201).json({ msg: "Projecto Creado Correctamente" })
    } catch (error) {
      console.log(error)
      return res.status(404).json({ msg: "hubo un error el proyecto" })
    }
  }

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({})
      res.json(projects)
    } catch (error) {
      console.log(error)
      return res.status(404).json({ msg: "No hay proyectos" })
    }
  }

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const project = await Project.findById(id).populate("tasks")
      if (!project) {
        return res.status(404).json({ msg: "Ese proyecto no existe" })
      }
      res.json(project)
    } catch (error) {
      console.log(error)
      return res.status(404).json({ msg: "Error al buscar el proyecto" })
    }
  }

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const project = await Project.findById(id)
      if (!project) {
        return res.status(404).json({ msg: "Ese proyecto no existe" })
      }
      project.clientName = req.body.clientName
      project.projectName = req.body.projectName
      project.description = req.body.description
      await project.save()
      return res.json({ msg: "Proyecto Actualizado", project })
    } catch (error) {
      console.log(error)
      return res
        .status(400)
        .json({ msg: "ID no válido o error al actualizar el proyecto" })
    }
  }

  //   static deleteProject = async (req: Request, res: Response) => {
  //     const { id } = req.params

  //     try {
  //       const project = await Project.findByIdAndDelete(id)
  //       if (!project) {
  //         return res.status(404).json({ msg: "Ese proyecto no existe" })
  //       }
  //       await project.deleteOne()
  //       res.send("Proyecto Eliminado")
  //     } catch (error) {
  //       console.log(error)
  //       return res.status(404).json({ msg: "Error al eliminar el proyecto" })
  //     }
  //   }
  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      // Ejecuta la búsqueda y eliminación en una sola operación.
      // 'deletedProject' será el documento eliminado o null si no se encontró.
      const deletedProject = await Project.findByIdAndDelete(id)

      if (!deletedProject) {
        // Si el resultado es null, el ID no existe.
        return res.status(404).json({ msg: "Ese proyecto no existe" })
      }

      // Si llega aquí, la eliminación ya se realizó con éxito.
      return res.send("Proyecto Eliminado Correctamente") // Usar 'return' para la respuesta final
    } catch (error) {
      console.error(error)
      // Puedes verificar si el error es por un ID malformado (ej: id no válido de MongoDB)
      return res
        .status(400)
        .json({ msg: "ID no válido o error al eliminar el proyecto" })
    }
  }
}
