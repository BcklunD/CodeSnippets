'use strict'

// Set up environment variable
require('dotenv').config()

// Import all needed modules
const express = require('express')
const hbs = require('express-hbs')
const session = require('express-session')
const createError = require('http-errors')
const logger = require('morgan')
const { join } = require('path')
const mongoose = require('./configs/mongoose.js')

// Create app object
const app = express()

// Connect to database using module mongoose.
// If error - log it and exit.
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})

// Setup helper method for hbs
hbs.registerHelper('if_equal', (a, b, opts) => {
  if (a === b) {
    return opts.fn(this)
  } else {
    return opts.inverse(this)
  }
})

// Setup view engine.
app.engine('hbs', hbs.express4({
  defaultLayout: join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', join(__dirname, 'views'))

// Request logger
app.use(logger('dev'))

// Serve static files.
app.use(express.static(join(__dirname, 'public')))

// Parse application/x-www-form-urlencoded.
app.use(express.urlencoded({ extended: true }))

// Setup session store with the given options.
const sessionOptions = {
  name: 'code snippets session',
  secret: 'snip the code',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'lax'
  }
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

// Set up session options
app.use(session(sessionOptions))

// Middleware to handle flash messages and different navbar if user is logged in
app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }
  if (req.session.user) res.locals.user = req.session.user

  next()
})

// Call on router to handle routes. Send 404 if not found.
app.use('/', require('./routes/codeSnippetsRouter'))
app.use('*', (req, res, next) => next(createError(404)))

// Error handler.
app.use((err, req, res, next) => {
  console.log(err.status)
  const viewData = {
    message: err.message,
    status: err.status || 500
  }
  // Render the error page.
  console.log(viewData)
  res
    .render('errors/error', { viewData })
})

// Listen to port 8000
app.listen(8000, () => {
  console.log('Server started on http://localhost:8000')
  console.log('Press Ctrl-C to terminate...')
})
