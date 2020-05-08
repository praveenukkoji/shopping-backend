const UserController = require('../controllers/users')
const checkAuth = require('../middleware/check-auth')
const express = require('express')
const router = express.Router()

router.post('/signup', UserController.signup)

router.post('/login', UserController.login)

router.delete('/:userId', checkAuth, UserController.delete_user)

module.exports = router;