const router = require ('express').Router()

const {createSchool, getallschool, getOneSchool} = require('../controller/schoolcontroller')
const upload = require ('../helper/multer')
router.post('/school',upload.single("photo"),createSchool);
router.get('/schools',getallschool)
router.get('/schools/:id',getOneSchool)
module.exports = router 


