const schoolModel = require('../model/schoolmodel')
const cloudinary = require('../helper/cloudinary')
const fs = require('fs')



exports.createSchool = async (req, res)=>{
    try {
        // console.log(req);
        const {fullName, address, email, department} =req.body
      


        const uploadImage = await cloudinary.uploader.upload(req.file.path, (err)=>{
            if(err){
                return res.status(400).json({
                    message: "This is a wrong image" + err.message

                })
            }
        })

        const data = {
            fullName,
            address,
            email,
            department,
            studentImageUrl: uploadImage.secure_url,
            studentImageId: uploadImage.public_id
        }
        fs.unlink(req.file.path, (err)=>{
            if(err){
                console.log(err.message)
            }else{
                console.log("File Removed Successfully")
            }
        })
        const newSchool = await schoolModel.create(data);

        return res.status(201).json({
            message: "New School Created Successfully",
            data: newSchool
        })

        // console.log(uploadImage);

        // const schoolData 

    } catch (error) {
     res.status(500).json({
        message: error.message
     })   
    }
}
exports.getallschool = async (req, res) => {
    try {
        const allSchool = await schoolModel.find()
        res.status(200).json({
            message: `all school in database`,
            data:allSchool
        })
    } catch (error) {
        res.status(500).json({
           message:error.message 
        })
    }
} 



























exports.getallschool = async (req, res) =>{
    try {
        const findallschool = await schoolModel.find()
        res.status(200).json({
            message: `All School in Database`,
            data:findallschool
        })
    } catch (error) {
        res.status(500).json({
            message:error.message 
        })
      
    }
}

exports.getOneSchool = async (req, res)=>{
    try {
        const {id} = req.params
        const findSchool = await schoolModel.find(id)
        if(!findSchool) {
            res.status(404).json({
                message:`school not found`
            })
        }else{
            res.status(200).json({
                message:`school found`,
                data: findSchool
            })
        }
    } catch (error) {
        res.status(500).json({
            message:error.message 
        }) 
    }
}
































exports.getOneSchool = async (req, res) =>{
    try {
        const { id } = req.params
        const findSchool = await schoolModel.findById(id)
        if (!findSchool) {
            res.status(404).json({
             message: `school not found`   
            })
        }  
        else {
            res.status(200).json({
            message: `school found`,
            data: findSchool 
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message: error.message 
        })
      
    }
}






















// exports.getallschool = async (req,res) =>{
//     try {
//         const findallschool = await schoolModel.find().populate("students", "name gender phoneNumber -_id");
//         res.status(200).json({
//             message:"All school found",
//             data:findallschool

//         })
//     } catch (error) {
//         //console.log("internal server error");
//         res.status(500).json({
//             message:error.message
//         }) 
//     }
// }