// This program is highly inspired by the solution to "pure-approval"

'use strict'

const mongoose = require('mongoose')

/**
 * Connect to database.
 *
 * @returns {Promise} Resolves to this if connection succeeded.
 */
async function connect () {
  mongoose.connection.on('connected', () => console.log('Mongoose connection is open.'))
  mongoose.connection.on('error', err => console.error(`Mongoose connection error has occurred: ${err}`))
  mongoose.connection.on('disconnected', () => console.log('Mongoose connection is disconnected.'))

  // Close Mongoose connection to database if node ends.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection is disconnected due to application termination.')
      process.exit(0)
    })
  })

  // Connect using the connection string from .env
  return mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

// Export function
module.exports = { connect: connect }
