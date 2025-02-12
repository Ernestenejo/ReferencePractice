const router = require ('express').Router()

const {createSchool, getallschool, getOneSchool, changeDP} = require('../controller/schoolcontroller')
const upload = require ('../helper/multer')
router.post('/school',upload.single("photo"),createSchool);
router.patch('/school/:id',upload.single("photo"), changeDP);
router.get('/schools',getallschool)
router.get('/schools/:id',getOneSchool)
module.exports = router 


