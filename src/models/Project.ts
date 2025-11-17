import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose"
import { ITask } from "./Task"
import { IUser } from "./User"

// PopulatedDoc - Traernos referencias de la tarea

export interface IProject extends Document {
  projectName: string
  clientName: string
  description: string
  tasks: (Types.ObjectId | PopulatedDoc<ITask & Document>)[] //Se usa un array porque un proyecto puede tener muchas tareas
  manager: PopulatedDoc<IUser & Document>
  team: PopulatedDoc<IUser & Document>[] // Un proyecto puede tener muchos usuarios en el equipo
}

const ProjectSchema: Schema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: [
      {
        type: Types.ObjectId,
        ref: "Task",
      },
    ],
    manager: {
      type: Types.ObjectId,
      ref: "User",
    },
    team: [
      {
        type: Types.ObjectId,
        ref: "User", // Donde se referencia los datos relaciones, los usuarios del equipo
      },
    ],
  },
  { timestamps: true }
)

const Project = mongoose.model<IProject>("Project", ProjectSchema)
export default Project
