const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;

const contactSchemaDefinition = {
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
};
const contactSchema = new Schema(contactSchemaDefinition);

const fieldDefinitions = {
  idField: {
    propName: '_id'
  },
  mainField: {
    propName: 'name',
    validationRegex: '^[A-Za-z0-9 ].+{0, 64}$'
  },
  otherFields: [
    {
      propName: 'address',
      type: 'Address',
      displayName: 'Address',
      validationRegex: '^[A-Za-z0-9,#-].+{0, 256}$'
    },
    {
      propName: 'phoneNumber',
      displayName: 'Phone Number',
      type: 'PhoneNumber',
      validationRegex: '^\\(\\d{3}\\) \\d{3}-\\d{4}$'
    }
  ]
}

exports.schema = contactSchema;
exports.fieldDefinitions = fieldDefinitions;
