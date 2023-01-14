const express=require('express')

const router = express.Router();

const authorization=require('../middleware/authorization')

const contactsController=require('../controllers/contacts')

//----->single contacts<-------
router.get('/getContacts', authorization, contactsController.getContacts);


//router.get('/getDetails:userId', authorization, contactsController.getDetails);

//router.post('/login', authorization, conversationController.getMessage);




//-------> Grroup Contacts<----------
router.get('/getGroups', authorization, contactsController.getGroups);

router.post('/newGroup', authorization, contactsController.postNewGroup);

//---join/leave Group routes----------
router.post('/joinGroup',authorization, contactsController.postJoinGroup);


module.exports = router;