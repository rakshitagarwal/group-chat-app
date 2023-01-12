const express=require('express')

const router=express.Router();

const conversationController = require('../controllers/conversation')

const authorization=require('../middleware/authorization')

router.post('/sendMessage', authorization, conversationController.postMessage);

router.get('/getMessages/:contactIdOfReceiver', authorization, conversationController.getMessage);




module.exports = router;