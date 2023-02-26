const express = require('express');

const usersController = require('../controllers/user');

const authenticator=require('../middleware/auth')

const router = express.Router();

router.post('/users', usersController.createUser)

router.get('/users/:creds', usersController.findUser)

router.get('/users', authenticator.authenticate, usersController.getUsers)

module.exports=router;