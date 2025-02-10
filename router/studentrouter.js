const studentRouter = require('express').Router();

const {createStudent,getOnestudent} = require ('../controller/studentcontroller');

studentRouter.post('/student/:id',createStudent);
studentRouter.get('/student/:id',getOnestudent)
module.exports = studentRouter

