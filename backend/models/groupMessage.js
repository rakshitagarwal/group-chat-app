const Sequelize = require('sequelize');
const sequelize = require('../util/database'); 


const GroupMessage = sequelize.define('groupMessage', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement:true
    },
    message_text: {
        type: Sequelize.STRING,
        allowNull:false
    },
    sent_to_groupNo: {
        type: Sequelize.INTEGER,
        allowNull:false
    }

})

module.exports = GroupMessage;