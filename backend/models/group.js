const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const Group=sequelize.define('group',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    group_name:{
        type:Sequelize.STRING,
        allowNull:false,
    }
    
})

module.exports=Group;