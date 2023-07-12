// Importing Components
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import axios from "axios";
// Importing React Hooks
import { useState, useEffect } from "react";
// Importing Packages
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";

function App() {
  // All States
  const [loading, setloading] = useState(true); // Pre-loader before page renders
  const [tasks, setTasks] = useState([]); // Task State
  const [showAddTask, setShowAddTask] = useState(false); // To reveal add task form

  // Pre-loader
  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 3500);
  }, []);

  // Fetching from Local Storage
  const getTasks = JSON.parse(localStorage.getItem("taskAdded"));

  useEffect(() => {
    let tasks = [];
    const getTask = async () => {
      const allTasks = await axios.get("/task/getTasks");
      tasks = [...allTasks.data];
      if (tasks.length !== 0) {
        localStorage.setItem("taskAdded", JSON.stringify(tasks));
      } 
    };
    getTask();
    if (getTasks === null) {
      setTasks([]);
    } else {
      setTasks(getTasks);
    }

    // eslint-disable-next-line
  }, []);

  // Add Task
  const addTask = async (task) => {
    const id = uuidv4();
    const newTask = { id, ...task };
    try {
      const response = await axios.post("/task/addTask", newTask); //create tasks in .csv file
      if (response.status === 200) {
        //Read tasks from .csv file
        const tasks = await axios.get("/task/getTasks");
        if (tasks.status === 200) {
          setTasks(tasks.data);
        }
        //setTasks([...tasks, newTask]);

        Swal.fire({
          icon: "success",
          title: "Yay...",
          text: "You have successfully added a new task!",
        });

        localStorage.setItem("taskAdded", JSON.stringify(tasks.data));
      } else {
        Swal.fire({
          icon: "success",
          title: "Oops..",
          text: "Some error occured please try again!",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    const deleteResponse = await axios.delete(`/task/deleteTask/${id}`);
    const newTasks = deleteResponse.data;

    setTasks(newTasks);

    Swal.fire({
      icon: "success",
      title: "Oops...",
      text: "You have successfully deleted a task!",
    });

    localStorage.setItem("taskAdded", JSON.stringify(newTasks));
  };

  // Edit Task
  const editTask = async (id) => {
    const text = prompt("Task Name");
    const day = prompt("Day and Time");
    const description = prompt("Description of task");
    const status = prompt("Status of task");
    const updatedTask = { id, text, day, description, status };
    const editResponse = await axios.patch("/task/updateTask", updatedTask);
 
    if (editResponse.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Yay...",
        text: "You have successfully edited an existing task!",
      });
      setTasks(editResponse.data);
      localStorage.setItem("taskAdded", JSON.stringify(editResponse.data));
    } else {
      Swal.fire({
        icon: "success",
        title: "Oops..",
        text: "Some error occured please try again!",
      });
    }
  };

  return (
    <>
      {loading ? (
        <div className="spinnerContainer">
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container">
          {/* App Header that has open and App Name */}
          <Header
            showForm={() => setShowAddTask(!showAddTask)}
            changeTextAndColor={showAddTask}
          />

          {/* Revealing of Add Task Form */}
          {showAddTask && <AddTask onSave={addTask} />}

          {/* Task Counter */}
          <h3>Number of Tasks: {tasks.length}</h3>

          {/* Displaying of Tasks */}
          {tasks.length > 0 ? (
            <Tasks tasks={tasks} onDelete={deleteTask} onEdit={editTask} />
          ) : (
            "No Task Found!"
          )}
        </div>
      )}
    </>
  );
}

export default App;
