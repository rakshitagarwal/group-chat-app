const express=require('express')

const router=express.Router();

const conversationController=require('../controllers/conversation')

router.post('/sendMessage', authorization, conversationController.postMessage);

router.get('/getMessages', authorization, conversationController.getMessage);




module.exports = router;