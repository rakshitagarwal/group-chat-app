const express=require('express')

const router = express.Router();

const authorization=require('../middleware/authorization')

const contactsController=require('../controllers/contacts')

router.get('/getContacts', authorization, contactsController.getContacts);


router.get('/getDetails:userId', authorization, contactsController.getDetails);

//router.post('/login', authorization, conversationController.getMessage);




module.exports = router;