const express = require('express');

const mongoose = require ('mongoose');
const router = require('./router/schoolrouter')
const  studentRouter = require('./router/studentrouter')


const app = express()
app.use(express.json())
app.use(router)
app.use(studentRouter)

mongoose.connect('mongodb+srv://eenejo69:vhLihPwGoXWrjgw4@cluster0.tz1of.mongodb.net/').then(()=>{

    console.log("database connected succesfully")
    
    app.listen(PORT,()=>{
        console.log(`server is listening to PORT:${PORT}`)
    })
}).catch((err)=>{
 console.log("unable to connect to db because"+err)
})
const PORT = 9876 

   
