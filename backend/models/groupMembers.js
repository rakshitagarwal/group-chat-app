const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const GroupMember=sequelize.define('groupMember',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    }
    
})

module.exports=Group;