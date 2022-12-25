const router = require('express').Router()
const userController = require('../controller/userController')

router.post('/register', userController.register)
router.get('/login', userController.login)

module.exports = router