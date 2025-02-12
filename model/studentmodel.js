const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    name:{
        type:String
    },
    gender:{
        type:String,
    },
    email:{
        type:String,
        lowercase:true
    },
    phoneNumber:{
        type:String
    },
    studentImageUrl:{
               type:String
    },
    studentImageId:{
          type:String
    },
    dateCreated:{
        type:Date,
        default:()=>{ const date = new Date
            return date.toISOString()
        }
    },

    school:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'school'

    }

})
const studentModel = mongoose.model('student',studentSchema)
module.exports = studentModel

