const mongoose = require('mongoose');
const uuid = require('uuid');

const Schema = mongoose.Schema;
const contactSchema = new Schema({
  _id: {
    type: String,
    required: true,
    default: uuid.v4()
  },
  name: {
    type: String,
    required: true,
    minlength: [1, 'Name too short'],
    maxlength: [64, 'Name too long']
  },
  address: {
    type: String,
    required: true,
    minlength: [1, 'Address too short'],
    maxlength: [256, 'Address too long']
  },
});

module.exports = contactSchema;
