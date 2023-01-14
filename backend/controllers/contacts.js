const User = require("../models/user");
const Group = require("../models/group");
const sequelize = require('sequelize');
const Op = sequelize.Op;


exports.getContacts = async (req, res, next) => {
    try {
        const contactArr = []
        const contacts = await User.findAll({
            where: {
                id: {
                    [sequelize.Op.not]: req.user.id
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
    } catch (err) {
        console.log(err);
    }
}


// exports.getDetails = async (req, res, next) => {
//     try {
//         const userId = req.params.userId;
//         const contacts = await User.findAll({
//             where: {
//                 id: userId
//             }
//         });
//         //console.log(contacts[0].dataValues);
//         contacts.forEach(element => {
//             const newObj = {
//                 id: element.dataValues.id,
//                 name: element.dataValues.name,
//                 phone: element.dataValues.phone
//             }
//             //console.log(element.dataValues);
//             contactArr.push(newObj);
//             //console.log(contactArr);
        
//         });
//         res.status(200).json({ contacts: contactArr, success: true });
//     } catch (err) {
//         console.log(err);
//     }
// }



exports.getGroups = async (req, res, next) => {
    try {
        const groups = await Group.findAll({ where: { userId: req.user.id } });
        const othersGroups = await Group.findAll({
            where: {
                userId: {
            [sequelize.Op.not] : req.user.id
                }
            }
        })
        res.status(200).json({ yourGroups: groups,othersGroups:othersGroups,success: true });
    } catch (err) {
        console.log(err);
    }
}

exports.postNewGroup = async (req, res, next) => {
    try {
        const isAlreadyPresent = await Group.findAll({ where: { group_name: req.body.group_name } });
        //console.log('res user',req.user);
        //console.log(isAlreadyPresent);
        if (isAlreadyPresent.length === 0) {
            
            const new_group = await req.user.createGroup({ group_name: req.body.group_name });
            console.log(new_group);
            
            res.status(200).json({ new_group: new_group, success: true ,message:'Successfully created'});
        }
        else {
            res.json({ message: 'Group Already Present, Try Other Names !!!', success: false });
        }
    } catch (err) {
        res.status(400).json({ success: false, message: 'some error occured', err: err });
    }
}

//-------join group----
exports.postJoinGroup = (req, res, next) => {
    const joinGroupId = req.body.joinGroupId;
    const userId = req.user.id;
    console.log(joinGroupId, userId);



}