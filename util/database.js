require('dotenv').config();
const Sequelize=require('sequelize')

const sequelize=new Sequelize('chat', 'root', '1qaz2wsx3edc', {
    dialect:'mysql',
    host:'localhost',
})

module.exports=sequelize