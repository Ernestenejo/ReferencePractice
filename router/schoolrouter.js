const router = require ('express').Router()
const {createSchool, getallschool} = require('../controller/schoolcontroller')

router.post('/school',createSchool)
router.get('/schools',getallschool)
module.exports = router 