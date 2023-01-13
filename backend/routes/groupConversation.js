const express=require('express')

const router=express.Router();

const groupConversationController = require('../controllers/groupConversation')

const authorization=require('../middleware/authorization')

router.post('/sendGroupMessage', authorization, groupConversationController.postGroupMessage);

router.get('/getGroupMessages/:groupId', authorization, groupConversationController.getGroupMessage);




module.exports = router;