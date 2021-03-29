// This is a mongoose model for a code snippet in the CodeSnippets site

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create a schema with error messages. Setting max length to not enable a code snippets that is too long
const codeSnippetSchema = new Schema({
  value: {
    type: String,
    required: '`{PATH}` is required!',
    max: [5000, '`{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
    min: [1, '`{PATH}` ({VALUE}) is beneath the limit ({MIN}).']
  },
  // I use my own ID to make it easier for the user to delete based on id.
  _id: Number,
  user: String
}, {
  timestamps: true,
  versionKey: false
})

// Create a model using the schema.
const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema)

// Export the model.
module.exports = CodeSnippet
