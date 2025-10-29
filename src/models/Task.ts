import mongoose, { Schema, Document, Types } from "mongoose"

// 1. Definición de los estados
const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed",
} as const

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus]

// 2. Interfaz corregida
export interface ITask extends Document {
  name: string // ⬅️ Corregido el typo 'projectNnameame'
  description: string
  project: Types.ObjectId
  status: TaskStatus
}

export const TaskSchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true, // ⬅️ Corregida sintaxis 'required'
    },
    description: {
      type: String,
      trim: true,
      required: true, // ⬅️ Corregida sintaxis 'required'
    },
    project: {
      type: Types.ObjectId,
      ref: "Project",
      required: true, // Asumimos que la tarea siempre pertenece a un proyecto
    }, // 3. Estructura de status CORREGIDA y con valor por defecto
    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING, // ⬅️ Valor por defecto
    },
  },
  { timestamps: true }
)

const Task = mongoose.model<ITask>("Task", TaskSchema)

export default Task
