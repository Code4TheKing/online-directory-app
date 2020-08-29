const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;
const contactSchema = new Schema({
  _id: {
    type: String,
    required: true,
    default: uuidv4
  },
  idpSubject: {
    type: String,
    maxlength: [64, 'Too long']
  },
  name: {
    type: String,
    required: true,
    minlength: [1, 'Too short'],
    maxlength: [64, 'Too long']
  },
  address: {
    type: String,
    maxlength: [256, 'Too long']
  },
  phoneNumber: {
    type: String,
    maxlength: [32, 'Too long']
  }
});

module.exports = contactSchema;
