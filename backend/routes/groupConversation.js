const express=require('express')

const router=express.Router();

const groupConversationController = require('../controllers/groupConversation')

const authorization=require('../middleware/authorization')

//router.post('/sendMessage', authorization, groupConversationController.postMessage);

//router.get('/getMessages/:contactIdOfReceiver', authorization, groupConversationController.getMessage);




module.exports = router;