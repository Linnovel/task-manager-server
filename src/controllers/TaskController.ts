import type { Request, Response } from "express"

import Task from "../models/Task"
import { Types } from "mongoose"

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body)
      task.project = req.project.id
      req.project.tasks.push(task._id as Types.ObjectId)

      await Promise.all([task.save(), req.project.save()])
      return res.json({
        msg: "Tarea creada correctamente y asociada al proyecto",
        task,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Hubo un error en el servidor" })
    }
  }

  static getProjectTaks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({
        project: req.project.id,
      }).populate("project")

      res.json(tasks)
    } catch (error) {
      console.log(error)
      res.status(500).json({ msg: "Hubo u nerror" })
    }
  }

  static getTaksById = async (req: Request, res: Response) => {
    try {
      res.json(req.tasks)
    } catch (error) {
      console.log(error)
      res.status(500).json({ msg: "Hubo u nerror" })
    }
  }

  static updateTask = async (req: Request, res: Response) => {
    try {
      req.tasks.name = req.body.name
      req.tasks.description = req.body.description
      await req.tasks.save()
      res.send("Tarea actualizada correctamente")
    } catch (error) {
      console.log(error)
      res.status(500).json({ msg: "Hubo u nerror" })
    }
  }

  static deleteTask = async (req: Request, res: Response) => {
    try {
      // 1. La variable 'req.tasks' contiene el objeto de la tarea a eliminar.
      //    El ID de la tarea a eliminar ya está en req.tasks._id (o req.tasks.id).
      const taskIdToDelete = req.tasks.id // Usamos .id que es más estándar en Mongoose/Express

      // 2. Eliminar la referencia de la tarea del array del proyecto
      req.project.tasks = req.project.tasks.filter(
        // Cambiamos el nombre de la variable a 'taskRef' para ser más claros, ya que contiene la Referencia de Tarea (ObjectID).
        (taskRef) => taskRef?.toString() !== taskIdToDelete.toString()
      )

      // 3. Ejecutar las dos operaciones en paralelo (delete y save del proyecto)
      await Promise.allSettled([req.tasks.deleteOne(), req.project.save()])

      return res.json({ message: "Tarea Eliminada correctamente" })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ msg: "Hubo un error en el servidor" })
    }
  }

  static updateStatusTask = async (req: Request, res: Response) => {
    try {
      const { status } = req.body
      req.tasks.status = status
      await req.tasks.save()
      res.send("Tarea actualizada")
    } catch (error) {
      console.error(error)
      return res.status(500).json({ msg: "Hubo un error en el servidor" })
    }
  }
}
