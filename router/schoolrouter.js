const router = require ('express').Router()
const {checkRole} = require('../middleware/authorization')
const upload = require ('../helper/multer');
const { checkLogins } = require('../middleware/authenticator');
const {createSchool, getallschool, changeDP, verifyMail, userLogin, confirmAdmin, forgotPassword, resetPassword} = require('../controller/schoolcontroller')



router.post('/school',checkRole, upload.single("photo"),createSchool);
router.patch('/school/:id',upload.single("photo"), changeDP);
router.get('/schools',checkRole, getallschool);
router.patch('/admin/:id',checkRole, confirmAdmin);

router.get('/mail/:id/:token', verifyMail);
router.post('/login', userLogin)
router.post('/schools',  createSchool)
router.get('/checkUser',checkLogins, (req,res)=>{
    res.send('welcome ' + req.user.fullName)
})

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
module.exports = router 


