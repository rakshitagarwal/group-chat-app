const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const ChatGroup=sequelize.define('chatGroup',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    group_name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    created_by_userId: {
        type: Sequelize.INTEGER,
        allowNull:false
    }
    
})

module.exports=ChatGroup;