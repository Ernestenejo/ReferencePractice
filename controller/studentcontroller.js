const studentModel = require ('../model/studentmodel')
const schoolModel = require('../model/schoolmodel')
exports.createStudent = async(req,res)=>{
    try {
        const findSchool = await schoolModel.findById(req.params.id)

        if(!findSchool){
            return res.status(404).json({message:'school not found'})
        }

        const {name,gender,phoneNumber,email} = req.body
        const data =  {
            name,
            gender,
            phoneNumber,
            email
         }
         const newstudent = new studentModel(data)
         newstudent.school=req.params.id
         await newstudent.save()
         findSchool.students.push(newstudent._id)
         await findSchool.save()
         res.status(201).json({
            message:'student created successfully',
            data:newstudent
         })
         
    } catch (err) {
        res.status(500).json({
            message:err.message
            
        })
    }
}
exports.getOnestudent = async (req,res)=>{
    try {
        const {id} = req.params
        const findOnestudent = await studentModel.findById(id).populate("school","fullName department -_id")//.select(["fullName","department"]);
console.log(findOnestudent)
        if(!findOnestudent){
            return res.status(404).json({
                message:'student not found'
            })
        }
        res.status(200).json({
            message:'student find',
            data:findOnestudent
        })
    } catch (error) {
 res.status(500).json({
            message:error.message
        })
    }
}
 