// This is a mongoose model for a user in the CodeSnippets site

'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

// Create a schema with error messages. Setting max length to not enable a username or password that is too long
const userSchema = new Schema({
  username: {
    type: String,
    required: '`{PATH}` is required!',
    max: [2000, '`{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
    min: [1, '`{PATH}` ({VALUE}) is beneath the limit ({MIN}).']
  },
  password: {
    type: String,
    required: '`{PATH}` is required!',
    max: [2000, '`{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
    min: [6, '`{PATH}` ({VALUE}) is beneath the limit ({MIN}).']
  }
}, {
  timestamps: true,
  versionKey: false
})

// Hash the password
userSchema.pre('save', async function () {
  // Check length of password
  if (this.password.length < 6) {
    throw new Error('Password is too short.')
  }
  this.password = await bcrypt.hash(this.password, 8)
})

/**
 * Authenticate a username and password.
 *
 * @param {string} username - The username to authenticate.
 * @param {string} password - The password to authenticate.
 * @returns {object} The user
 */
userSchema.statics.authenticate = async function (username, password) {
  // Get user from database
  const user = await this.findOne({ username })
  // If username doesn't exist or the password is wrong, throw error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login credentials')
  }

  // Return the user
  return user
}

// Create a model using the schema.
const User = mongoose.model('User', userSchema)

// Export the model.
module.exports = User
