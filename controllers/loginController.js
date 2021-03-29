// This module handles the login part of this website.

const User = require('../models/User')

const loginController = {}

/**
 * DEVELOPEMENT: Use this to clear all code snippets and logins.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {object} next - Express next object
 */
loginController.clear = async (req, res, next) => {
  User.collection.drop()

  next()
}

/**
 * Render the login page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
loginController.loginForm = async (req, res) => {
  // Check if user is already logged in
  if (req.session.user) {
    req.session.flash = { type: 'fail', text: `You are already logged in as '${req.session.user}'.` }
    res.redirect('/all')
  }

  const viewData = {
    value: undefined
  }
  res.render('codeSnippets/login', { viewData })
}

/**
 * Handles the login process.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} In case of error, return register form together with error message.
 */
loginController.loginProces = async (req, res) => {
  // Check if user is already logged in
  if (req.session.user) {
    req.session.flash = { type: 'fail', text: `You are already logged in as '${req.session.user}'.` }
    res.redirect('/all')
  }

  try {
    // Try to authenticate user, error is thrown otherwise
    const user = await User.authenticate(req.body.user, req.body.password)
    req.session.user = user.username
    req.session.flash = { type: 'success', text: `You are logged in as '${user.username}'.` }

    res.redirect('/all')
  } catch (error) {
    // In case of an error, view the form and send error message.
    req.session.flash = { type: 'fail', text: [error.message] || [error.errors.value.message] }
    return res.redirect('/login')
  }
}

/**
 * Render the register page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
loginController.registerForm = async (req, res) => {
  const viewData = {
    value: undefined
  }
  res.render('codeSnippets/register', { viewData })
}

/**
 * Handles the register process.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} In case of error, return register form together with error message.
 */
loginController.registerProcess = async (req, res) => {
  const username = req.body.user
  // Check if the 2 password fields match
  if (req.body.password1 !== req.body.password2) {
    req.session.flash = { type: 'fail', text: 'The passwords does not match.' }
    res.redirect('/register')

  // Check if username is taken
  } else if (await User.findOne({ username })) {
    req.session.flash = { type: 'fail', text: 'That username is taken.' }
    res.redirect('/register')
  } else {
    // Else create a new user
    try {
      const user = new User({
        username: req.body.user,
        password: req.body.password1
      })
      await user.save()

      // Redirect and send a flash message together with the redirect
      req.session.flash = { type: 'success', text: 'Your new account was created successfully.' }
      res.redirect('/login')
    } catch (error) {
      // In case of an error, view the form and send error message.
      req.session.flash = { type: 'fail', text: [error.message] || [error.errors.value.message] }
      return res.redirect('/register')
    }
  }
}

/**
 * Render the logout page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
loginController.logoutForm = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    req.session.flash = { type: 'fail', text: 'You are not logged in.' }
    res.redirect('/all')
  }

  const viewData = {
    value: undefined
  }
  res.render('codeSnippets/logout', { viewData })
}

/**
 * Handles the logout process.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} In case of error, return register form together with error message.
 */
loginController.logoutProcess = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    req.session.flash = { type: 'fail', text: 'You are not logged in.' }
    res.redirect('/all')
  }

  // Log out user
  req.session.user = null
  req.session.flash = { type: 'success', text: 'You are now logged out.' }

  res.redirect('/all')
}

/**
 * Used to authorize a user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {object} next - Express next object.
 * @returns {object} If not authorized, return error.
 */
loginController.authorize = async (req, res, next) => {
  // Check if user is valid and exists
  if (!req.session.user) {
    const error = new Error('Forbidden')
    error.status = 403
    return next(error)
  }

  next()
}

module.exports = loginController
