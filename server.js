const express = require('express');
const app = express();
const path = require('path')
const taskRouter = require('./routes/taskRoute')
app.use(express.static(path.join(__dirname,'./build')))

app.use(express.json())
app.use('/task',taskRouter);

const PORT= process.env.port || 3000;
app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`)
})