const schoolModel = require('../model/schoolmodel')

exports.createSchool = async (req,res)=>{
    
    try {
        const  {fullName,department,address,email} = req.body
        const data = {
            fullName,
            department,
            address,
            email:email.toLowerCase()
        }
       const newSchool =   await schoolModel.create(data)
        res.status(201).json({
            message:`school created successfully`,
            data:newSchool
        })


    } catch (err) {
        res.status(500).json({
            message:err.message
        })
    }
}
exports.getallschool = async (req,res) =>{
    try {
        const findallschool = await schoolModel.find().populate("students", "name gender phoneNumber -_id");
        res.status(200).json({
            message:"All school found",
            data:findallschool

        })
    } catch (error) {
        //console.log("internal server error");
        res.status(500).json({
            message:error.message
        }) 
    }
}