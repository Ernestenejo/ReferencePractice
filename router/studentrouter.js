const studentRouter = require('express').Router();
const {checkLogins} = require('../middleware/authenticator')
const {createStudent,getOnestudent, updateStudent} = require ('../controller/studentcontroller');

studentRouter.post('/student/:id', checkLogins, createStudent);
studentRouter.get('/student/:id',getOnestudent)
studentRouter.patch('/update/:id', updateStudent)
module.exports = studentRouter

