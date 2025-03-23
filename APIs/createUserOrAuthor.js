const UserAutor=require('../models/userAuthorModel')
async function createUserOrAuthor(req,res){
    //get the user
    const newUserAuthor=req.body
    //find user by email id
    const userInDb=await UserAutor.findOne({email:newUserAuthor.email})
    //if user or author existed
    if(userInDb!=null){
        //check with role
        if(newUserAuthor.role===userInDb.role){
            res.status(200).send({message:newUserAuthor.role,payload:userInDb})
        }else{
            res.status(200).send({message:"Invalid role"})
        }
    }else{
        let newUser=new UserAutor(newUserAuthor)
        let newUserAuthorDoc=await newUser.save()
        res.status(201).send({message:newUserAuthorDoc.role,payload:newUserAuthorDoc})
    }
}

module.exports=createUserOrAuthor

