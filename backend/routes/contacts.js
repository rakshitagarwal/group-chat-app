const express=require('express')

const router = express.Router();

const authorization=require('../middleware/authorization')

const contactsController=require('../controllers/contacts')

router.get('/getContacts', authorization, contactsController.getContacts);

router.get('/getChatGroups', authorization, contactsController.getChatGroups);

router.post('/newGroup', authorization, contactsController.postNewGroup);

router.post('/addNewMember', authorization, contactsController.postAddNewMember);

router.post('/removeMember', authorization, contactsController.postRemoveUser);

router.get('/getGroupMembers/:groupId', authorization, contactsController.getGroupMembers);

router.post('/leaveGroup', authorization, contactsController.postLeaveGroup);

router.post('/makeAdmin', authorization, contactsController.postMakeAdmin);

router.post('/removeAdmin', authorization, contactsController.postRemoveFromAdmin);

module.exports = router;