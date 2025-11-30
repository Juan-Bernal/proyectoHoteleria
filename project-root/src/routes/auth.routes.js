// src/routes/auth.routes.js
const { Router } = require('express')
const router = Router()
const controller = require('../controllers/auth.controller')

router.get('/login', controller.loginForm)
router.post('/login', controller.login)
router.get('/logout', controller.logout)

module.exports = router
