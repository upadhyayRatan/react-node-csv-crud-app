const { stringify } = require("csv-stringify/sync");
const { parse } = require("csv-parse/sync");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const { Transform } = require("stream");

const columns = {
  id: "id",
  text: "text",
  day: "day",
  description: "description",
  status: "status",
};
const filePath=process.env.FILE_PATH||'my.csv';

router.post("/addTask", async (req, res) => {
  let task = req.body;
  //convert the object into csv
  let data = [[task.id, task.text, task.day, task.description, task.status]];
  let columns = {
    id: "id",
    text: "text",
    day: "day",
    description: "description",
    status: "status",
  };
  //file does not exist then add header
  try {
    let fileExist = fs.existsSync(filePath);
    if (!fileExist) {
      const output1 = stringify(data, { header: true, columns: columns });
      fs.writeFile(filePath, output1, (err) => {
        if (err) throw err;
        res.status(200).send({ message: "Added data to file" });
      });
    } else {
      const output1 = stringify(data, { header: false, columns: columns });
      fs.appendFile(filePath, output1, (err) => {
        if (err) throw err;
        res.status(200).send({ message: "Appended data to file" });
      });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

//get all tasks from file
router.get("/getTasks", (req, res) => {
  const csvToObjectArr = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, encodiing, callback) {
      this.push(
        JSON.stringify(
          parse(chunk, {
            columns: true,
            skipEmptyLines: true,
          })
        )
      );
      callback();
    },
  });
  const csvData = fs.createReadStream(filePath, "utf-8");
  try {
    csvData.pipe(csvToObjectArr).pipe(res);
  } catch (e) {
    res.status(500).send(e);
  }
});

//update task
router.patch("/updateTask", async (req, res) => {
  const newTask = req.body;
  const csvData = fs.createReadStream(filePath, "utf-8");

  const csvToObjectArr = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, encodiing, callback) {
      this.push(
        JSON.stringify(
          parse(chunk, {
            columns: true,
            skipEmptyLines: true,
          })
        )
      );
      callback();
    },
  });

  const objArrToCsv = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      const inputData = [];
      JSON.parse(chunk).forEach((obj) => {
        inputData.push(Object.values(obj));
      });
      const csvOutput = stringify(inputData, {
        header: true,
        columns: columns,
      });
      //writeStream.write(csvOutput);
      this.push(JSON.stringify(csvOutput));

      callback();
    },
  });

  const writeToFile = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      const writeStream = fs.createWriteStream(filePath, { flags: "w" });
      console.log("chunk in write", chunk);
      writeStream.write(JSON.parse(chunk));
      this.push(
        JSON.stringify(
          parse(JSON.parse(chunk), {
            columns: true,
            skipEmptyLines: true,
          })
        )
      );
      callback();
    },
  });

  const updateTaskArr = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      const taskArr = JSON.parse(chunk);
      console.log("taskAr", taskArr);
      const updatedTasks = taskArr.map((task) => {
        if (task.id === newTask.id) {
          return {
            id: newTask.id,
            text: newTask.text,
            day: newTask.day,
            description: newTask.description,
            status: newTask.status,
          };
        }
        return task;
      });
      console.log("Updated data ", updatedTasks);
      this.push(JSON.stringify(updatedTasks));
      callback();
    },
  });

  try {
    csvData
      .pipe(csvToObjectArr)
      .pipe(updateTaskArr)
      .pipe(objArrToCsv)
      .pipe(writeToFile)
      .pipe(res);
  } catch (err) {
    res.status(400).send(err);
  }
});

//delete task from csv file
router.delete("/deleteTask/:id", async (req, res) => {
  const csvToObjectArr = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, encodiing, callback) {
      console.log("Chunk in readable", chunk);
      this.push(
        JSON.stringify(
          parse(chunk, {
            columns: true,
            skipEmptyLines: true,
          })
        )
      );
      callback();
    },
  });

  const objArrToCsv = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      const inputData = [];
      JSON.parse(chunk).forEach((obj) => {
        inputData.push(Object.values(obj));
      });
      console.log("input data", inputData);
      const csvOutput = stringify(inputData, {
        header: true,
        columns: columns,
      });
      console.log("csv output", csvOutput);
      //writeStream.write(csvOutput);
      this.push(JSON.stringify(csvOutput));

      callback();
    },
  });

  const writeToFile = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      const writeStream = fs.createWriteStream(filePath, { flags: "w" });
      console.log("chunk in write", chunk);
      writeStream.write(JSON.parse(chunk));
      this.push(
        JSON.stringify(
          parse(JSON.parse(chunk), {
            columns: true,
            skipEmptyLines: true,
          })
        )
      );
      callback();
    },
  });
  const id = req.params.id;

  const deleteTask = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      const filteredData = JSON.parse(chunk).filter((task) => task.id !== id);
      console.log("Filtered data", filteredData);
      this.push(JSON.stringify(filteredData));
      callback();
    },
  });
  
  const csvData=fs.createReadStream(filePath, "utf-8");

  try {
    csvData
      .pipe(csvToObjectArr)
      .pipe(deleteTask)
      .pipe(objArrToCsv)
      .pipe(writeToFile)
      .pipe(res);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
