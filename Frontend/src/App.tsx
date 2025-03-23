import axios from "axios";
import { useState, useEffect } from "react";
import { Calendar } from "./components/ui/Calendar";
import { Button } from "./components/ui/button";
import { PlusCircle, CheckCircle, Circle, MinusCircle } from "lucide-react";
//import { getTasks, updateTaskStatus } from "./app/actions"
import { format } from "date-fns";
import { TaskModal } from "./components/TaskModel";
import { type Task, TaskStatus } from "./types";
import "./index.css";

// Team members
const teamMembers = ["Komal", "Ankush", "Animesh", "Ashvini", "Nasar"];
const URL = "http://localhost:1111";

export default function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [visibleDates, setVisibleDates] = useState<string[]>([]);

  // Generate 7 days starting from the selected date
  useEffect(() => {
    const dates: string[] = [];
    const currentDate = new Date(date);
    const dateFormat: string = "yyyy-MM-dd";
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + i);
      dates.push(format(newDate, dateFormat));
    }

    setVisibleDates(dates);
  }, [date]);

  // Fetch tasks when visible dates change
  useEffect(() => {
    const fetchTasks = async () => {
      if (visibleDates.length > 0) {
        const response = await axios.get(
          `${URL}/api/tasks/date/${visibleDates[0]}}`
        );
        console.log(response.data);
        setTasks((prevTask) => [...prevTask, response.data]);
      }
    };

    fetchTasks();
  }, [visibleDates]);

  // Open modal to add a new task
  const handleAddTask = (user: string, date: string) => {
    setSelectedUser(user);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // Handle task creation
  const handleTaskCreated = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
  };

  // Update task status
  const handleStatusChange = async (task: Task) => {
    let newStatus: TaskStatus;

    // Cycle through statuses
    switch (task.status) {
      case TaskStatus.NOT_STARTED:
        newStatus = TaskStatus.IN_PROGRESS;
        break;
      case TaskStatus.IN_PROGRESS:
        newStatus = TaskStatus.COMPLETED;
        break;
      case TaskStatus.COMPLETED:
        newStatus = TaskStatus.NOT_STARTED;
        break;
      default:
        newStatus = TaskStatus.NOT_STARTED;
    }

    //const updatedTask = { ...task, status: newStatus }
    /*const success = await updateTaskStatus(updatedTask.id, newStatus)

    if (success) {
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)))
    }*/
  };

  // Get tasks for a specific user and date
  const getUserTasks = (person: string, date: string) => {
    console.log(tasks, date);
    return tasks.filter(
      (task) => task.person === person && task.date.substring(0, 11) === date
    );
  };

  // Render status icon based on task status
  const renderStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case TaskStatus.IN_PROGRESS:
        return <MinusCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  return (
    <div className="container mx-auto py-8 overflow-y-scroll">
      <h1 className="text-3xl font-bold mb-6">OpsBee Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="border rounded-md p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">
            Viewing tasks from{" "}
            {format(new Date(visibleDates[0] || date), "MMM d, yyyy")} to{" "}
            {format(
              new Date(visibleDates[visibleDates.length - 1] || date),
              "MMM d, yyyy"
            )}
          </h2>
          <p className="text-muted-foreground mb-2">
            Click on + to add a task. Click on status icons to cycle through:
            not started → in progress → completed.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border p-3 min-w-[150px] text-left">
                Team Member
              </th>
              {visibleDates.map((date) => (
                <th key={date} className="border p-3 min-w-[200px] text-left">
                  {format(new Date(date), "EEE, MMM d")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((user) => (
              <tr key={user}>
                <td className="border p-3 font-medium">{user}</td>
                {visibleDates.map((date) => {
                  const userTasks = getUserTasks(user, date);

                  return (
                    <td
                      key={`${user}-${date}`}
                      className="border p-3 align-top"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground">
                          {userTasks.length} tasks
                        </span>
                        <Button
                          //variant="ghost"
                          //size="sm"
                          onClick={() => handleAddTask(user, date)}
                          className="h-6 w-6 p-0"
                        >
                          <PlusCircle className="h-5 w-5" />
                          <span className="sr-only">Add task</span>
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {userTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-start gap-2 p-2 rounded bg-muted/50"
                          >
                            <button
                              onClick={() => handleStatusChange(task)}
                              className="mt-1 flex-shrink-0"
                            >
                              {renderStatusIcon(task.status!)}
                            </button>
                            <span className="text-sm">{task.description}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <TaskModal
          person={selectedUser}
          date={selectedDate}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}
