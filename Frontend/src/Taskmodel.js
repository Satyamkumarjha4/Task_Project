import { useState } from "react"
import { format } from "date-fns"
import { createTask } from "../services/api"
import "./TaskModal.css"

const TaskStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
}

function TaskModal({ user, date, onClose, onTaskCreated }) {
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!description.trim()) return

    setIsSubmitting(true)

    try {
      const taskData = {
        user,
        date,
        description,
        status: TaskStatus.PENDING,
      }

      const newTask = await createTask(taskData)

      if (newTask) {
        onTaskCreated(newTask)
      }
    } catch (error) {
      console.error("Failed to add task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Task for {user}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="date-info">Date: {format(new Date(date), "EEEE, MMMM d, yyyy")}</div>

          <div className="form-group">
            <label htmlFor="description">Task Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task details..."
              className="task-textarea"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal