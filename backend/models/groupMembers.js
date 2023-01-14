const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const GroupMember=sequelize.define('groupMember',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull:false,
        default:false
    }

    
})

module.exports=GroupMember;