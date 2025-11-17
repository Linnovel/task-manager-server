import type { Request, Response } from "express"

import Task from "../models/Task"
import { Types } from "mongoose"
import User from "../models/User"
import Project from "../models/Project"

export class TeamMemberController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    const { email } = req.body

    const user = await User.findOne({ email }).select("id email name")

    if (!user) {
      const error = new Error("Usuario no encontrado")
      return res.status(404).json({ msg: error.message })
    }

    res.json({ user })
  }

  static addTeamMemberById = async (req: Request, res: Response) => {
    const { userId } = req.body

    // findById expects the id string (not an object)
    const user = await User.findById(userId).select("id")

    if (!user) {
      const error = new Error("Usuario no encontrado")
      return res.status(404).json({ msg: error.message })
    }

    if (
      req.project.team.some((team) => team?.toString() === user.id.toString())
    ) {
      const error = new Error("El usuario ya pertenece al equipo del proyecto")
      return res.status(400).json({ msg: error.message })
    }

    req.project.team.push(user.id)
    await req.project.save()
    res.send({ msg: "Miembro agregado al equipo correctamente" })
  }

  static deleteMemberById = async (req: Request, res: Response) => {
    const { userId } = req.body

    if (
      !req.project.team.some((team) => team?.toString() === userId.toString())
    ) {
      const error = new Error("El usuario no existe al equipo del proyecto")
      return res.status(409).json({ error: error.message })
    }

    req.project.team = req.project.team.filter(
      (teamMember) => teamMember?.toString() !== userId
    )

    await req.project.save()

    res.send({ msg: "Miembro eliminado del equipo correctamente. RIP" })
  }

  static getProjectTeam = async (req: Request, res: Response) => {
    const project = await Project.findById(req.project.id).populate({
      path: "team",
      select: "id email name",
    })

    if (!project) {
      const error = new Error("Proyecto no encontrado")
      return res.status(404).json({ msg: error.message })
    }

    res.json(project?.team)
  }
}
