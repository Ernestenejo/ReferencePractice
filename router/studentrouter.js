const studentRouter = require('express').Router();
const {checkLogins} = require('../middleware/authenticator')
const {createStudent,getOnestudent} = require ('../controller/studentcontroller');

studentRouter.post('/student/:id', checkLogins, createStudent);
studentRouter.get('/student/:id',getOnestudent)
module.exports = studentRouter

