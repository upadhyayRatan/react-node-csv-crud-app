const express= require('express')
const taskRouter= require('../taskRoute')

const app = express();
app.use(express.json());
app.use('/task',taskRouter);

module.exports= app;