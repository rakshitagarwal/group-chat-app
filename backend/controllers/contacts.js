const User = require("../models/user");
const ChatGroup = require("../models/chatgroup");
const GroupMember = require("../models/groupMembers");
const sequelize = require("sequelize");
const Op = sequelize.Op;

exports.getContacts = async (req, res, next) => {
  try {
    const contactArr = [];
    const contacts = await User.findAll({
      where: {
        id: {
          [sequelize.Op.not]: req.user.id,
        },
      },
    });
    contacts.forEach((element) => {
      const newObj = {
        id: element.dataValues.id,
        name: element.dataValues.name,
        phone: element.dataValues.phone,
      };
      contactArr.push(newObj);
    });
    res.status(200).json({ contacts: contactArr, success: true });
  } catch (err) {
    console.log(err);
  }
};

exports.getChatGroups = async (req, res, next) => {
  const groupInfo = [];
  try {
    const groups = await req.user.getChatGroups()
    groups.forEach((group) => {
      const obj = {
        group_name:group.dataValues.group_name ,
        groupId: group.dataValues.id
      }
      groupInfo.push(obj);
    })
    res.status(200).json({groupInfo:groupInfo,success: true });
  } catch (err) {
      res.json({ message: "cant get groups", success: false });
  }
};

exports.postNewGroup = async (req, res, next) => {
  const { group_name } = req.body;
  const userId = req.user.id;
  try {
    if (!group_name) {
        res.status(404).json({message:"No Name Entered"})
    }
    const isAlreadyPresent = await ChatGroup.findAll({ where: { group_name:group_name } });
    if (isAlreadyPresent.length === 0) {
      const newChatGroup = await req.user.createChatGroup({group_name:group_name,created_by_userId:userId},{through:{isAdmin:true}});
      console.log(newChatGroup);
      res.status(201).json({ success: true, message: "Group Successfully Created", newChatGroup: newChatGroup.dataValues });
    }
        else {
            res.json({ success: false, message: "Group Name is not Availble for You. try for unique names !!" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: "some Error Occured !!" });
    }
}


exports.postAddNewMember = async (req, res, next) => { 
  const { mobileNo ,groupId} = req.body;
  const adminUser = req.user.id;

  const isAdmin = await GroupMember.findOne({ where: { userId: adminUser, chatGroupId: groupId, isAdmin: true } });
  if (!isAdmin) { return res.status(404).json({ message: "You dont have Admin Powers for this group", success: false }) }
  
  const isUserRegistered = await User.findOne({ where: { phone: mobileNo } });
  if (!isUserRegistered) { return res.status(400).json({ success: false, message: "This User is not Register in our data base. Please ask him to signUp first" }) };

  const addNewMember = await GroupMember.create({ userId: isUserRegistered.id, chatGroupId: groupId, isAdmin:false});
  res.status(200).json({ success: true, message: "User added to the group", addedUser: addNewMember.dataValues });
}

exports.getGroupMembers = async (req, res, next) => {
  try {
    const memberArr = [];
    const chatGroupId = req.params.groupId;
    const members = await GroupMember.findAll({ where: { chatGroupId: chatGroupId } });
     members.forEach(element => {
          memberArr.push(element.dataValues)
    })
    res.status(200).json({groupMembers:memberArr,success: true, message: "fetched successfully" });
  } catch (err) {
    console.log(err);
  }
}

exports.postMakeAdmin = async (req, res, next) => {
  const { targetId, groupId } = req.body;
  const userId = req.user.id;
  console.log(targetId, groupId, userId);
  try { 
    const isAdmin = await GroupMember.findOne({ where: { userId: userId, chatGroupId: groupId, isAdmin: true } });
    if (!isAdmin) { return res.json({ message: "Only Admin can remove or add members", success: false }) };

    await GroupMember.update({isAdmin: true }, { where: { userId: targetId, chatGroupId: groupId, isAdmin: false } });
    res.status(200).json({ success: true, message: "Now Group has one more admin !!" })
  } catch(err) {
    console.log(err)
  }
}

exports.postRemoveFromAdmin = async (req, res, next) => {
  const { targetId, groupId } = req.body;
  const userId = req.user.id;
  console.log(targetId, groupId, userId);
  try { 
    const isAdmin = await GroupMember.findOne({ where: { userId: userId, chatGroupId: groupId, isAdmin: true } });
    if (!isAdmin) { return res.json({ message: "Only Admin can remove or add members", success: false }) };

    await GroupMember.update({isAdmin: false }, { where: { userId: targetId, chatGroupId: groupId, isAdmin: true } });
    res.status(200).json({success:true, message:"One admin has been removed !!"})
  }catch (err) {
    console.log(err)
  }
}

exports.postRemoveUser = async (req, res, next) => {
  const { targetId, groupId } = req.body;
  const userId = req.user.id;
  console.log(targetId, groupId, userId);
  try { 
    const isAdmin = await GroupMember.findOne({ where: { userId: userId, chatGroupId: groupId, isAdmin: true } });
    if (!isAdmin) { return res.json({ message: "Only Admin can remove or add members", success: false }) };

    await GroupMember.destroy({ where: {userId: targetId, chatGroupId: groupId}});
    res.status(200).json({success:true, message:"User removed successfully"})
}catch (err) {
    console.log(err)
  }
}

exports.postLeaveGroup = async (req, res, next) => {
  const {groupId } = req.body;
  const userId = req.user.id;
  try { 
    await GroupMember.destroy({ where: {userId: userId, chatGroupId: groupId}});
    res.status(200).json({ success: true, message: "You left Group Succesfully" })
  } catch (err) {
    res.status(400).json({ success:false, message: "Some error occured, please try again" })
  }
}

