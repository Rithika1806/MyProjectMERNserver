//mini express app
const exp=require('express')
const userApp=exp.Router()
const UserAuthor=require('../models/userAuthorModel')
const expressAsyncHandler=require('express-async-handler')
const createUserOrAuthor=require('./createUserOrAuthor')
const Article=require('../models/articleModel')

//implement API

userApp.get('/',expressAsyncHandler(async(req,res)=>{
    const userList=await UserAuthor.find({role:"user"})
    res.send({message:"All users",payload:userList})
}))

//post
userApp.post('/user',expressAsyncHandler(createUserOrAuthor))

//delete
userApp.put('/:email', expressAsyncHandler(async (req, res) => {
    const userEmail = req.params.email; // Email is a string, no need to convert to Number

    const updatedUser = await UserAuthor.findOneAndUpdate(
        { email: userEmail },   // Find user by email
        { isActive: false },    // Only update isActive to false
        { new: true }           // Return the updated user document
    );

    if (!updatedUser) {
        return res.status(404).send({ message: "User not found" });
    }

    res.send({ message: "User Deleted", payload: updatedUser });
}));

//write comment
userApp.put('/comment/:articleId',expressAsyncHandler(async(req,res)=>{
    const commentObj=req.body
    const articleWithComments=await Article.findOneAndUpdate(
        {articleId:req.params.articleId},
        {$push:{comments:commentObj}},
        {new:true})
    res.send({message:"Comment added",payload:articleWithComments})
}))

//export API
module.exports=userApp
