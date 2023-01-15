const Sequelize=require('sequelize')

const sequelize= new Sequelize('groupchat','root','password',{
    dialect:'mysql',
    host:'localhost'
})



module.exports=sequelize;