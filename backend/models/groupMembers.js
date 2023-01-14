const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const GroupMember=sequelize.define('groupMember',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    }
    
})

module.exports=GroupMember;