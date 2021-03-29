'use strict'

const router = require('express').Router()
const controller = require('../controllers/codeSnippetsController')
const loginController = require('../controllers/loginController')

// DEVELOPEMENT: Use this to clear all code snippets and logins
router.get('/clear', loginController.clear, controller.clear)

// Welcome page
router.get('/', controller.index)

// View all code snippets
router.get('/all', controller.all)
router.post('/all', controller.all)

// Create a new code snippet.
router.get('/new', loginController.authorize, controller.newForm)
router.post('/new', loginController.authorize, controller.newProcess)

// Update code snippet
router.get('/update', loginController.authorize, controller.updateForm)
router.get('/update/:itemId', loginController.authorize, controller.updateForm)
router.post('/update', loginController.authorize, controller.updateProcess)
router.post('/update/:itemId', loginController.authorize, controller.updateProcess)

// Delete code snippet
router.get('/delete', loginController.authorize, controller.deleteForm)
router.get('/delete/:itemId', loginController.authorize, controller.deleteForm)
router.post('/delete', loginController.authorize, controller.deleteProcess)
router.post('/delete/:itemId', loginController.authorize, controller.deleteProcess)

// Register
router.get('/register', loginController.registerForm)
router.post('/register', loginController.registerProcess)

// Login
router.get('/login', loginController.loginForm)
router.post('/login', loginController.loginProces)

// Logout
router.get('/logout', loginController.logoutForm)
router.post('/logout', loginController.logoutProcess)

// Exports.
module.exports = router
