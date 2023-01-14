const express=require('express')

const router=express.Router();



const authorization=require('../middleware/authorization')

//router.post('/sendGroupMessage', authorization, groupConversationController.postGroupMessage);

//router.get('/getGroupMessages/:groupId', authorization, groupConversationController.getGroupMessage);




module.exports = router;