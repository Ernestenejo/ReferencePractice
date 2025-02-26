const router = require ('express').Router()
const {checkRole} = require('../middleware/authorization')

const {createSchool, getallschool, getOneSchool, changeDP, verifyMail, userLogin, confirmAdmin} = require('../controller/schoolcontroller')
const upload = require ('../helper/multer');
const { checkLogins } = require('../middleware/authenticator');
router.post('/school',checkRole, upload.single("photo"),createSchool);
router.patch('/school/:id',upload.single("photo"), changeDP);
router.get('/schools',checkRole, getallschool)
router.patch('/admin/:id',checkRole, confirmAdmin)
router.get('/schools/:id',getOneSchool)
router.get('/mail/:id/:token', verifyMail)
router.post('/login', userLogin)
router.post('/schools',  createSchool)
router.get('/checkUser',checkLogins, (req,res)=>{
    res.send('welcome ' + req.user.fullName)
})
module.exports = router 


