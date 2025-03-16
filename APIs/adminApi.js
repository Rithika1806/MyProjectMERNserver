//mini express app
const exp=require('express')
const adminApp=exp.Router()
const expressAsyncHandler=require('express-async-handler')
const createUserOrAuthor=require('./createUserOrAuthor')

//implement API
adminApp.post('/admin',expressAsyncHandler(createUserOrAuthor))

//export API
module.exports=adminApp