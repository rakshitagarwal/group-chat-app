const Sequelize = require('sequelize');
const sequelize = require('../util/database'); 


const Message = sequelize.define('message', {
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
    sent_to: {
        type: Sequelize.INTEGER,
        allowNull:false
    }

})

module.exports = Message;