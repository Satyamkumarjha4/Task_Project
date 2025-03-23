import React, { useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import { Task } from "../types";

const TaskStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

interface TaskModal extends Task {
  onTaskCreated: (task: Task) => void;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModal> = ({
  person,
  date,
  onClose,
  onTaskCreated,
}) => {
  console.log("task modal me hu!");

  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submit handler me hu!");

    if (!description.trim()) return;

    setIsSubmitting(true);

    try {
      const taskData = {
        person,
        date,
        description,
        status: TaskStatus.PENDING,
      };
      console.log("ha aaya ");

      const newTask : Task = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/tasks`,
        taskData
      );
      console.log(newTask);

      if (newTask) {
        onTaskCreated(newTask);
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Task for {person}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="date-info">
            Date: {format(new Date(date), "EEEE, MMMM d, yyyy")}
          </div>

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
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
