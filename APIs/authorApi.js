//mini express app
const exp=require('express')
const authorApp=exp.Router()
const UserAuthor=require('../models/userAuthorModel')
const expressAsyncHandler=require('express-async-handler')
const createUserOrAuthor=require('./createUserOrAuthor')
const Article=require('../models/articleModel')
const { findOneAndUpdate } = require('../models/userAuthorModel')

const {requireAuth,clerkMiddleware}=require('@clerk/express')
require('dotenv').config()//Only through this we can access the envi variables
authorApp.use(clerkMiddleware())

//implement API
authorApp.get('/',expressAsyncHandler(async(req,res)=>{
    const authorList=await UserAuthor.find({role:"author"})
    res.send({message:"All authors",payload:authorList})
}))

authorApp.put('/:email', expressAsyncHandler(async (req, res) => {
    const authorEmail = req.params.email; // Email is a string, no need to convert to Number

    const updatedAuthor = await UserAuthor.findOneAndUpdate(
        { email: authorEmail },   // Find user by email
        { isActive: false },    // Only update isActive to false
        { new: true }           // Return the updated user document
    );

    if (!updatedAuthor) {
        return res.status(404).send({ message: "Author not found" });
    }

    res.send({ message: "Author Deleted", payload: updatedAuthor });
}));


//post
authorApp.post('/author',expressAsyncHandler(createUserOrAuthor))

//create article
authorApp.post('/article',expressAsyncHandler(async(req,res)=>{
    const newArticleObj=req.body
    const newArticle=new Article(newArticleObj)
    const articleObj=await newArticle.save()
    res.status(201).send({message:"article published",payload:articleObj})
}))

//read all articles
authorApp.get('/articles',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    const listOfArticles=await Article.find({isArticleActive:true})
    res.status(200).send({message:"articles",payload:listOfArticles})
}))

authorApp.get('/unauthorized',(req,res)=>{
    res.send({message:"Unauthorized request"})
})

//modify an article(done by an author)
authorApp.put('/article/:articleId',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    const modifiedArticle=req.body
    const modifiedId=Number(req.params.articleId)
    const latestArticle=await Article.findOneAndUpdate({articleId:modifiedId},{...modifiedArticle},{new:true})
    res.send({message:"Article modified",payload:latestArticle})
}))

//soft delete article
authorApp.put('/articles/:articleId',expressAsyncHandler(async(req,res)=>{
    const modifiedArticle=req.body
    const modifiedId=Number(req.params.articleId)
    const latestArticle=await Article.findOneAndUpdate({articleId:modifiedId},{...modifiedArticle},{new:true})
    res.send({message:"Article deleted or restored",payload:latestArticle})
}))

//filter articles
authorApp.get('/articles/:category',expressAsyncHandler(async(req,res)=>{
    const filter=req.params.category
    const filterArticles=await Article.find({$and:[{category:filter},{isArticleActive:true}]})
    res.send({message:"Article filtered",payload:filterArticles})
}))

//export API
module.exports=authorApp


// //mini express app
// const exp=require('express')
// const authorApp=exp.Router()
// const UserAuthor=require('../models/userAuthorModel')
// const expressAsyncHandler=require('express-async-handler')
// const createUserOrAuthor=require('./createUserOrAuthor')
// const Article=require('../models/articleModel')
// const { findOneAndUpdate } = require('../models/userAuthorModel')

// const {requireAuth,clerkMiddleware}=require('@clerk/express')
// require('dotenv').config()//Only through this we can access the envi variables
// authorApp.use(clerkMiddleware())

// //implement API
// authorApp.get('/',expressAsyncHandler(async(req,res)=>{
//     const authorList=await UserAuthor.find({$and:[{isActive:true},{role:"author"}]})
//     res.send({message:"All authors",payload:authorList})
// }))

// authorApp.put('/enabled/:email',expressAsyncHandler(async(req,res)=>{
//     const authorEmail = req.params.email; // Email is a string, no need to convert to Number
//     const updatedAuthor = await UserAuthor.findOneAndUpdate(
//         { email: authorEmail },   // Find user by email
//         { $set: { isActive: true } }, // Use `$set` explicitly
//         { new: true }           // Return the updated user document
//     );

//     if (!updatedAuthor) {
//         return res.status(404).send({ message: "Author not found" });
//     }

//     res.send({ message: "Author Enabled", payload: updatedAuthor });
// }))

// authorApp.put('/block/:email', expressAsyncHandler(async (req, res) => {
//     const authorEmail = req.params.email; // Email is a string, no need to convert to Number

//     const updatedAuthor = await UserAuthor.findOneAndUpdate(
//         { email: authorEmail },   // Find user by email
//         { isActive: false },    // Only update isActive to false
//         { new: true }           // Return the updated user document
//     );

//     if (!updatedAuthor) {
//         return res.status(404).send({ message: "Author not found" });
//     }

//     res.send({ message: "Author Deleted", payload: updatedAuthor });
// }));


// //post
// authorApp.post('/author',expressAsyncHandler(createUserOrAuthor))

// //create article
// authorApp.post('/article',expressAsyncHandler(async(req,res)=>{
//     const newArticleObj=req.body
//     const newArticle=new Article(newArticleObj)
//     const articleObj=await newArticle.save()
//     res.status(201).send({message:"article published",payload:articleObj})
// }))

// //read all articles
// authorApp.get('/articles',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
//     const listOfArticles=await Article.find({isArticleActive:true})
//     res.status(200).send({message:"articles",payload:listOfArticles})
// }))

// authorApp.get('/unauthorized',(req,res)=>{
//     res.send({message:"Unauthorized request"})
// })

// //modify an article(done by an author)
// authorApp.put('/article/:articleId',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
//     const modifiedArticle=req.body
//     const modifiedId=Number(req.params.articleId)
//     const latestArticle=await Article.findOneAndUpdate({articleId:modifiedId},{...modifiedArticle},{new:true})
//     res.send({message:"Article modified",payload:latestArticle})
// }))

// //soft delete article
// authorApp.put('/articles/:articleId',expressAsyncHandler(async(req,res)=>{
//     const modifiedArticle=req.body
//     const modifiedId=Number(req.params.articleId)
//     const latestArticle=await Article.findOneAndUpdate({articleId:modifiedId},{...modifiedArticle},{new:true})
//     res.send({message:"Article deleted or restored",payload:latestArticle})
// }))

// //filter articles
// authorApp.get('/articles/:category',expressAsyncHandler(async(req,res)=>{
//     const filter=req.params.category
//     const filterArticles=await Article.find({$and:[{category:filter},{isArticleActive:true}]})
//     res.send({message:"Article filtered",payload:filterArticles})
// }))

// //export API
// module.exports=authorApp