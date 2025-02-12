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
            schoolImageUrl: uploadImage.secure_url,
            schoolImageId: uploadImage.public_id
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

exports.changeDP = async (req, res) =>{
    try{
        const {id} = req.params;
        const findSchool = await schoolModel.findById(id);
console.log("somto is not active today")
        if(!findSchool){
            return res.status(404).json({
                message: "School Not Found"
            })
        }

        //This gets the image file from Cloudinary via the file path
const cloudImage = await cloudinary.uploader.upload(req.file.path, (err)=>{
    if(err){
        return res.status(404).json({
            message: err.message
        })
    }
})
        const newPhoto = {
            schoolImageUrl: cloudImage.secure_url, 
            schoolImageId: cloudImage.public_id
        }

        const delImage = await cloudinary.uploader.destroy(findSchool.schoolImageId, (err)=>{
            if(err){
                return res.status(404).json({
                    message: err.message
                })
            }
        })

        fs.unlink(req.file.path, (err)=>{
            if(err){
                console.log(err.message)
            }else{
                console.log("Previous File Removed Successfully")
            }
        })

        const updateImage = await schoolModel.findByIdAndUpdate(id, newPhoto, {new: true})
        return res.status(200).json({
            message: "Image Successfully Updated"
        })
    }catch(err){
        res.status(500).json({
            message: "Internal Server Error" + err.message,

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