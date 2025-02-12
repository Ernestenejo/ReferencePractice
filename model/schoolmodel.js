const mongoose = require('mongoose');
const schoolSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    department: {
        type: String,
        enum: {
            values: ["science", "art", "commercial"],
            message: "department can be either science,art or commercial"
        }
    },
    adress: {
        type: String,

    },
    email: {
        type: String,
        unique: true
    },
    studentImageUrl: {
        type: String
    },
    studentImageId: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: () => {
            const date = new Date
            return date.toISOString()
        }
    },

    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    }]

})
const schoolModel = mongoose.model('school', schoolSchema)
module.exports = schoolModel