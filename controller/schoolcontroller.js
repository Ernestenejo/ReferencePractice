const schoolModel = require('../model/schoolmodel')
const cloudinary = require('../helper/cloudinary')
const fs = require('fs');
const sendMail = require('../helper/email');
const jwt = require('jsonwebtoken');
const signup = require('../helper/signUp');
const bcrypt = require('bcryptjs');


exports.createSchool = async (req, res)=>{
    try {
        // console.log(req);
        const {fullName, address, password, email, department} =req.body
        
        const uploadImage = await cloudinary.uploader.upload(req.file.path, (err)=>{
            if(err){
                return res.status(400).json({
                    message: "This is a wrong image" + err.message

                })
            }
        })
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(password, salt);
// Store hash in your password DB.

        const data = {
            fullName,
            address,
            password: hash,
            email:email.toLowerCase(), 
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
        const token = await jwt.sign({id:newSchool._id}, "secret_key", {expiresIn: '3mins'})
        // console.log(token)
        const link = `${req.protocol}://${req.get('host')}/mail/${newSchool._id}/${token}`
        console.log(link)
        const subject = "welcome" + " " + fullName;
        const text  =`welcome ${newSchool.fullName}, Kindly use this link to verify your email ${link}`;
        sendMail({ subject:subject, email:newSchool.email, html:signup(link, newSchool.fullName) })
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
exports.verifyMail = async (req, res) => {
    try{

        const { id } = req.params
        console.log(req.params.token)
        const checkuser = await schoolModel.findById( id )
       if(checkuser.isVerified== true){
        return res.status(400).json({message: "email already been verified"})
       }
        await jwt.verify(req.params.token, "secret_key", (error)=>{
            
        if(error){
            return res.status(404).json({
                message: "Email Link Has Expired"
            })   
        }
     } )
        const verifyingMail = await schoolModel.findByIdAndUpdate(id, {isVerified:true})
        res.status(200).json({
            message: "email verified successfully"
        })
    }catch(error){
        console.error(error.message);
    }
}

exports.userLogin = async (req, res) => {
    try{
        const { email, passWord } = req.body
        const checkEmail = await schoolModel.findOne({email:email.toLowerCase()}) //.select(["fullName", "email", "_id", "password"])
        if(!checkEmail){
            return res.status(404).json({
                message: "Email not found"
            })
        }
        const checkPassword = await bcrypt.compare(passWord, checkEmail.password)
        if(!checkPassword){
            return res.status(400).json({
                message:" InCorrect Password"
            })
        }
        if(checkEmail.isVerified == false){
            return res.status(404).json({
                message: 'Email not Verified'
            })
        }
        // const newData = {
        //     fullName: checkEmail.fullName,
        //     email: checkEmail.email,
        //     id: checkEmail._id
            
        // }
        const {isVerified,schoolImageUrl,schoolImageId,department,students,dateCreated,password, ...others} = checkEmail._doc

        // console.log(newData)
        const token = await jwt.sign({id:checkEmail._id}, "secret_key", {expiresIn: '24hr'})
        res.status(200).json({
            message: "Login Succesfully",
            data: others,
            token
        })

    }catch(error){
        res.status(500).json({
            message: "Unable to Login" + error.message
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

exports.confirmAdmin = async (req, res)=>{
    try{
        const comfirmAdmin = await schoolModel.findByIdAndUpdate(req.params.id, {isAdmin:true}, {new:true})
        
        res.status(200).json({
            message:" The User is now an Admin"
        })

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}


exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await schoolModel.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ message: "Email not found" });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });
      const link = `${req.protocol}://${req.get("host")}/reset-password/${user._id}/${token}`;
      
      sendMail({
        subject: "Password Reset Request",
        email: user.email,
        html: `Click the link to reset your password: <a href='${link}'>Reset Password</a>`
      });
      
      res.status(200).json({ message: "Password reset link sent to email" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.resetPassword = async (req, res) => {
    try {
      const { id, token } = req.params;
      const { newPassword } = req.body;
      
      jwt.verify(token, process.env.JWT_SECRET, async (error) => {
        if (error) return res.status(400).json({ message: "Invalid or expired token" });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await schoolModel.findByIdAndUpdate(id, { password: hashedPassword });
        
        res.status(200).json({ message: "Password reset successfully" });
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };





























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