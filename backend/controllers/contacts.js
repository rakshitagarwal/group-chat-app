const User = require("../models/user");
const sequelize = require('sequelize');
const Op = sequelize.Op;


exports.getContacts = async (req, res, next) => {
    const contactArr=[]
    const contacts = await User.findAll({
        where: {
            id: {
                [sequelize.Op.not]:req.user.id
            }
        }
    });
    //console.log(contacts[0].dataValues);
    contacts.forEach(element => {
        const newObj = {
            id: element.dataValues.id,
            name: element.dataValues.name,
            phone: element.dataValues.phone
        }
        //console.log(element.dataValues);
        contactArr.push(newObj);
        //console.log(contactArr);
        
    });
    res.status(200).json({ contacts: contactArr, success: true });
}


exports.getDetails = async (req, res, next) => {
    const userId = req.params.userId;
    const contacts = await User.findAll({
        where: {
            id: userId
        }
    });
    //console.log(contacts[0].dataValues);
    contacts.forEach(element => {
        const newObj = {
            id: element.dataValues.id,
            name: element.dataValues.name,
            phone: element.dataValues.phone
        }
        //console.log(element.dataValues);
        contactArr.push(newObj);
        //console.log(contactArr);
        
    });
    res.status(200).json({ contacts: contactArr, success: true });
}