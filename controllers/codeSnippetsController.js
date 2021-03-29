'use strict'

// Import moment to handle timestamps and the 2 models in the database
const moment = require('moment')
const CodeSnippet = require('../models/CodeSnippet')
const Counter = require('../models/Counter')

// Create the controller object on which to save controller functions
const codeSnippetsController = {}

// All controller functions

/**
 * DEVELOPEMENT: Use this to clear all code snippets and logins.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeSnippetsController.clear = async (req, res) => {
  CodeSnippet.collection.drop()
  Counter.collection.drop()
  req.session.flash = { type: 'success', text: 'All code snippets and logins cleared.' }
  res.redirect('/all')
}

/**
 * Render the index page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeSnippetsController.index = async (req, res) => {
  const viewData = {
    value: undefined
  }
  res.render('codeSnippets/index', { viewData })
}

/**
 * Display all code snippets.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
codeSnippetsController.all = async (req, res, next) => {
  try {
    const viewData = {
      codeSnippets: (await CodeSnippet.find({}))
        .map(codeSnippet => ({
          id: codeSnippet._id,
          createdAt: moment(codeSnippet.createdAt).fromNow(),
          value: codeSnippet.value,
          user: codeSnippet.user
        }))
        .sort((a, b) => a.value - b.value)
        .filter(codeSnippet => !req.body.value || codeSnippet.user === req.body.value),
      filter: req.body.value
    }
    res.render('codeSnippets/all', { viewData })
  } catch (error) {
    next(error)
  }
}

/**
 * Present the form to create a new code snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeSnippetsController.newForm = async (req, res) => {
  res.render('codeSnippets/new')
}

/**
 * Creates a new code snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} In case of error, return new form together with error message.
 */
codeSnippetsController.newProcess = async (req, res) => {
  try {
    // Get counter
    const counter = await Counter.findById('codeSnippetsCounter')
    let id = 1

    // If not initialized, initialize it
    if (!counter) {
      const newCounter = new Counter({
        _id: 'codeSnippetsCounter',
        count: 2
      })
      await newCounter.save()
    } else {
      // Save id and update counter
      id = counter.count
      await Counter.findByIdAndUpdate('codeSnippetsCounter', { count: id + 1 })
    }
    // Create new code snippet
    const codeSnippet = new CodeSnippet({
      value: req.body.value,
      _id: id,
      user: req.session.user
    })
    await codeSnippet.save()

    // Redirect and send a flash message together with the redirect
    req.session.flash = { type: 'success', text: 'The code snippet was saved successfully.' }
    res.redirect('/new')
  } catch (error) {
    // In case of an error, view the form and send error message.
    req.session.flash = { type: 'fail', text: [error.message] || [error.errors.value.message] }
    return res.render('codeSnippets/new', {
      value: req.body.value
    })
  }
}

/**
 * Present the form to update a code snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeSnippetsController.updateForm = async (req, res) => {
  const itemId = req.params.itemId

  // Render form to choose id of snippet to update
  if (!itemId) {
    res.render('codeSnippets/update')
  } else {
    // Check if item with ID exists
    const item = await CodeSnippet.findById(itemId)
    if (!item) {
      req.session.flash = { type: 'fail', text: 'No code snippet with that ID exists.' }
      res.redirect('/update')
    } else {
      // Render form to update code snippet
      const codeSnippet = await CodeSnippet.findById(itemId)
      const viewData = {
        value: codeSnippet.value,
        id: itemId,
        user: codeSnippet.user
      }
      res.render('codeSnippets/update', { viewData })
    }
  }
}

/**
 * Updates an existing code snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} In case of error, return update form together with error message.
 */
codeSnippetsController.updateProcess = async (req, res) => {
  const itemId = req.params.itemId

  // If no itemId in params, redirect to page to update item with id from body
  if (!itemId) {
    res.redirect('/update/' + req.body.id)
  } else {
  // Else check if item with this ID exists
    const item = (await CodeSnippet.findById(itemId))
    if (!item) {
      req.session.flash = { type: 'fail', text: 'No code snippet with that ID exists.' }
      res.redirect('/update')
    // Check if code snippet belongs to this user
    } else if (item.user !== req.session.user) {
      req.session.flash = { type: 'fail', text: 'You can only update your own code snippets.' }
      res.redirect('/all')
    } else {
      try {
        await CodeSnippet.findByIdAndUpdate(itemId, { value: req.body.value })
        req.session.flash = { type: 'success', text: 'The code snippet was updated successfully.' }
        res.redirect('/update/' + itemId)
      } catch (error) {
        // In case of an error, view the form and send error message.
        req.session.flash = { type: 'fail', text: [error.message] || [error.errors.value.message] }
        return res.render('codeSnippets/update')
      }
    }
  }
}

/**
 * Present the form to delete a code snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeSnippetsController.deleteForm = async (req, res) => {
  const itemId = req.params.itemId

  // Render form to choose id of snippet to delete
  if (!itemId) {
    res.render('codeSnippets/delete')
  } else {
    // Check if item with ID exists
    const item = await CodeSnippet.findById(itemId)
    if (!item) {
      req.session.flash = { type: 'fail', text: 'No code snippet with that ID exists.' }
      res.redirect('/delete')
    } else {
      // Render form to update code snippet
      const codeSnippet = await CodeSnippet.findById(itemId)
      const viewData = {
        value: codeSnippet.value,
        id: itemId,
        user: codeSnippet.user
      }
      res.render('codeSnippets/delete', { viewData })
    }
  }
}

/**
 * Deletes an existing code snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} In case of error, return update form together with error message.
 */
codeSnippetsController.deleteProcess = async (req, res) => {
  const itemId = req.params.itemId

  // If no itemId in params, redirect to page to update item with id from body
  if (!itemId) {
    res.redirect('/delete/' + req.body.id)
  } else {
  // Else check if item with this ID exists
    const item = (await CodeSnippet.findById(itemId))
    if (!item) {
      req.session.flash = { type: 'fail', text: 'No code snippet with that ID exists.' }
      res.redirect('/delete')
    } else if (item.user !== req.session.user) {
      req.session.flash = { type: 'fail', text: 'You can only delete your own code snippets.' }
      res.redirect('/all')
    } else {
      try {
        await CodeSnippet.findByIdAndDelete(itemId, { value: req.body.value })
        req.session.flash = { type: 'success', text: 'The code snippet was deleted successfully.' }

        // If no code snippets left, restart ID counter from 1
        if ((await CodeSnippet.find({})).length === 0) {
          await Counter.findByIdAndUpdate('codeSnippetsCounter', { count: 1 })
        }

        res.redirect('/delete')
      } catch (error) {
        // In case of an error, view the form and send error message.
        req.session.flash = { type: 'fail', text: [error.message] || [error.errors.value.message] }
        return res.render('codeSnippets/delete')
      }
    }
  }
}

module.exports = codeSnippetsController
