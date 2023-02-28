const Chats=require('../models/chats');
const { Op } = require("sequelize");  // we use the Op object properties to create SQL queries with operators.

// Get Chat
const getChats=(req, res, next)=>{
    console.log(req.query)
    if(req.query.lastId){
        Chats.findAll({  // finding all chats  
            where:{  //where is help to check the where in the chats table 
                id:{
                    [Op.gt]:parseInt(req.query.lastId)// op object properties to create sql queries with operators like greater than or lesser than 
                    // gt : greater than 
                },
                groupId:parseInt(req.query.groupId)// find the first argument to a string and parsing the staring then return as a integer and requsting the groupID


            }
        }).then(response=>{
            res.status(200).send(response)
        }).catch(err=>console.log(err))
    }else{
        Chats.findAll({where: {groupId:req.query.groupId}}).then(response=>{
            res.status(200).send(response)
        }).catch(err=>console.log(err))
    }
}

// Post Chat
const postChat=(req, res, next)=>{
  
    Chats.create({
        name:req.user.name,
        message:req.body.message, // requesting the message from the api call
        userId:req.user.id,  // requsting the userid form the user with id
        groupId:req.body.groupId   // requestin the groupID form the groupid
    }).then(response=>{
        res.status(201).send(response)
    }).catch(err=>console.log(err))
}

module.exports ={
    getChats,
    postChat
}