const exp=require('express')
const app=exp()
const mongoose=require('mongoose')
require('dotenv').config()
const port=process.env.PORT || 4000

//accept request from any other domain
const cors=require('cors')
app.use(cors())

//db connection
mongoose.connect(process.env.DBURL)
.then(()=>{
    app.listen(port,()=>console.log(`server on port ${port}...`))
    console.log("DB connection Sucessful")
})
.catch(err=>console.log("Error in DB connection ",err))

app.use(exp.json())
//connect API routes 
const userApp=require('./APIs/userApi')
app.use('/user-api',userApp)

const authorApp=require('./APIs/authorApi')
app.use('/author-api',authorApp)

const adminApp=require('./APIs/adminApi')
app.use('/admin-api',adminApp)

//NOTE we need add the error handling middlewear as the last property of the entry point
app.use((err,req,res,next)=>{
    console.log("err object in express error handler :",err)
    res.send({message:err.message})
})

 