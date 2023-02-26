const express = require('express');

const chatsController = require('../controllers/chats');
const authenticator=require('../middleware/auth')

const router = express.Router();

router.get('/chats', authenticator.authenticate, chatsController.getChats)

router.post('/chats',authenticator.authenticate, chatsController.postChat)

module.exports=router;
