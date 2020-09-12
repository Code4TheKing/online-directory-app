const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const NAME_REGEX = '^[A-Za-z0-9 _]+$';
const NAME_MAX_LENGTH = 32;
const NAME_VALIDATION_ERROR_MESSAGE = 'Alphabets (A-Z), numbers (0-9), spaces, or underscores(_)';
const ADDRESS_REGEX = '^[A-Za-z0-9\\s,#-]*$';
const ADDRESS_MAX_LENGTH = 128;
const ADDRESS_VALIDATION_ERROR_MESSAGE = 'Alphabets (A-Z), numbers (0-9), spaces, or special characters (,#-)';
const PHONE_NUMBER_REGEX = '^\\(\\d{3}\\) \\d{3}-\\d{4}$';
const PHONE_NUMBER_MAX_LENGTH = 14;
const PHONE_NUMBER_VALIDATION_ERROR_MESSAGE = 'Must be of the format (XXX) XXX-XXXX';

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
  picture: {
    type: {
      link: {
        type: String,
        required: true
      },
      hash: {
        type: String,
        required: true
      }
    }
  },
  name: {
    type: String,
    required: true,
    minlength: [1, 'Too short'],
    maxlength: [NAME_MAX_LENGTH, 'Too long'],
    validate: {
      validator: (value) => {
        return new RegExp(NAME_REGEX).test(value);
      },
      message: NAME_VALIDATION_ERROR_MESSAGE
    }
  },
  address: {
    type: String,
    maxlength: [ADDRESS_MAX_LENGTH, 'Too long'],
    validate: {
      validator: (value) => {
        return new RegExp(ADDRESS_REGEX).test(value);
      },
      message: ADDRESS_VALIDATION_ERROR_MESSAGE
    }
  },
  phoneNumber: {
    type: String,
    maxlength: [PHONE_NUMBER_MAX_LENGTH, 'Too long'],
    validate: {
      validator: (value) => {
        return !value || new RegExp(PHONE_NUMBER_REGEX).test(value);
      },
      message: PHONE_NUMBER_VALIDATION_ERROR_MESSAGE
    }
  }
}, { typePojoToMixed: false });

const fieldDefinitions = {
  idField: {
    propName: '_id'
  },
  pictureField: {
    propName: 'picture'
  },
  mainField: {
    propName: 'name',
    displayName: 'Name',
    validation: {
      regex: NAME_REGEX,
      maxLength: NAME_MAX_LENGTH,
      errorMessage: NAME_VALIDATION_ERROR_MESSAGE
    }
  },
  otherFields: [
    {
      propName: 'address',
      type: 'Address',
      displayName: 'Address',
      validation: {
        regex: ADDRESS_REGEX,
        maxLength: ADDRESS_MAX_LENGTH,
        errorMessage: ADDRESS_VALIDATION_ERROR_MESSAGE
      }
    },
    {
      propName: 'phoneNumber',
      displayName: 'Phone Number',
      type: 'PhoneNumber',
      validation: {
        regex: PHONE_NUMBER_REGEX,
        maxLength: PHONE_NUMBER_MAX_LENGTH,
        errorMessage: PHONE_NUMBER_VALIDATION_ERROR_MESSAGE
      }
    }
  ]
}

exports.schema = contactSchema;
exports.fieldDefinitions = fieldDefinitions;
