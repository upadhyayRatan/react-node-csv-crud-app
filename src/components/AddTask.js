import { useState } from "react";
import Swal from "sweetalert2";

const AddTask = ({ onSave }) => {
  const [text, setText] = useState("");
  const [day, setDay] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    if (!text || !day || !description || !status) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Fill in all the details or close the form!",
      });
    }
    else {
      onSave({ text, day, description, status });
    }
    setText("");
    setDay("");
    setStatus("");
    setDescription("");
  };

  return (
    <form className="add-form row" onSubmit={onSubmit}>
      <div className="form-control col-lg-6">
        <label>Task</label>
        <input
          type="text"
          placeholder="add task"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="form-control col-lg-6">
        <label>Description</label>
        <input
          type="text"
          placeholder="add description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-control col-lg-6">
        <label>Day & Time</label>
        <input
          type="text"
          placeholder="add day & time"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
      </div>
      <div className="form-control col-lg-6">
        <label>Status</label>
        <input
          type="text"
          placeholder="completed/in-progress"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>

      <input type="submit" className="btn btn-block" value="Save Task" />
    </form>
  );
};

export default AddTask;
