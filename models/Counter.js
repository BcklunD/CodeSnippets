// This is a mongoose model used to increment the id of the code snippets

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create a schema with error messages.
const counterSchema = new Schema({
  _id: { type: String, required: true },
  count: { type: Number, required: true, default: 1 }
}, {
  timestamps: true,
  versionKey: false
})

// Create a model using the schema.
const Counter = mongoose.model('Counter', counterSchema)

// Export the model.
module.exports = Counter
