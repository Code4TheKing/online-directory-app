/** @format */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const NAME_REGEX = '^[\\w !@#\\$%\\^&\\*\\(\\)]+$';
const NAME_MAX_LENGTH = 32;
const NAME_VALIDATION_ERROR_MESSAGE = 'Alphanumerics (A-Z, 0-9), special characters (!@#$%^&*()_), or spaces';
const ADDRESS_REGEX = '^[A-Za-z0-9\\s,#-]*$';
const ADDRESS_MAX_LENGTH = 128;
const ADDRESS_VALIDATION_ERROR_MESSAGE = 'Alphabets (A-Z), numbers (0-9), spaces, or special characters (,#-)';
const PHONE_NUMBER_REGEX = '^\\(\\d{3}\\) \\d{3}-\\d{4}$';
const PHONE_NUMBER_MAX_LENGTH = 14;
const PHONE_NUMBER_VALIDATION_ERROR_MESSAGE = 'Must be of the format (XXX) XXX-XXXX';
const EMAIL_REGEX =
  "^((([!#$%&'*+\\-/=?^_`{|}~\\w])|([!#$%&'*+\\-/=?^_`{|}~\\w][!#$%&'*+\\-/=?^_`{|}~\\.\\w]{0,}[!#$%&'*+\\-/=?^_`{|}~\\w]))[@]\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*)$";
const EMAIL_MAX_LENGTH = 32;
const EMAIL_VALIDATION_ERROR_MESSAGE = 'Must be an email address';

const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
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
    contact: {
      type: [
        {
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
          phoneNumber: {
            type: String,
            maxlength: [PHONE_NUMBER_MAX_LENGTH, 'Too long'],
            validate: {
              validator: (value) => {
                return !value || new RegExp(PHONE_NUMBER_REGEX).test(value);
              },
              message: PHONE_NUMBER_VALIDATION_ERROR_MESSAGE
            }
          },
          emailAddress: {
            type: String,
            maxlength: [EMAIL_MAX_LENGTH, 'Too long'],
            validate: {
              validator: (value) => {
                return !value || new RegExp(EMAIL_REGEX).test(value);
              },
              message: EMAIL_VALIDATION_ERROR_MESSAGE
            }
          }
        }
      ],
      validate: (list) => {
        const optionalKeys = ['phoneNumber', 'emailAddress'];
        for (const item of list) {
          let hasValidKeys = false;
          if (!(item.name && optionalKeys.some((key) => !!item[key]))) {
            throw new Error(
              `Item ${item} in contact must have at least one valid key in addition to 'name'. Valid keys: ${optionalKeys}`
            );
          }
          if (item.phoneNumber) {
            if (!new RegExp(PHONE_NUMBER_REGEX).test(item.phoneNumber)) {
              throw new Error(PHONE_NUMBER_VALIDATION_ERROR_MESSAGE);
            }
            hasValidKeys = true;
          }
          if (item.emailAddress) {
            if (!new RegExp(EMAIL_REGEX).test(item.emailAddress)) {
              throw new Error(EMAIL_VALIDATION_ERROR_MESSAGE);
            }
            hasValidKeys = true;
          }
          if (!hasValidKeys) {
            throw new Error(
              `Item ${item} in contact must have at least one valid key in addition to 'name'. Valid keys: ${optionalKeys}`
            );
          }
        }
        return true;
      }
    }
  },
  { typePojoToMixed: false }
);

const fieldDefinitions = {
  idField: {
    propName: '_id'
  },
  pictureField: {
    propName: 'picture'
  },
  mainField: {
    propName: 'name',
    type: 'String',
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
      type: 'TextArea',
      displayName: 'Address',
      validation: {
        regex: ADDRESS_REGEX,
        maxLength: ADDRESS_MAX_LENGTH,
        errorMessage: ADDRESS_VALIDATION_ERROR_MESSAGE
      }
    },
    {
      propName: 'contact',
      displayName: 'Contact',
      type: 'ObjectList',
      mainInnerField: 'name',
      innerFields: {
        name: {
          type: 'Name',
          displayName: 'Name',
          validation: {
            regex: NAME_REGEX,
            maxLength: NAME_MAX_LENGTH,
            errorMessage: NAME_VALIDATION_ERROR_MESSAGE
          }
        },
        phoneNumber: {
          propName: 'phoneNumber',
          displayName: 'Phone Number',
          type: 'PhoneNumber',
          validation: {
            regex: PHONE_NUMBER_REGEX,
            maxLength: PHONE_NUMBER_MAX_LENGTH,
            errorMessage: PHONE_NUMBER_VALIDATION_ERROR_MESSAGE
          }
        },
        emailAddress: {
          propName: 'emailAddress',
          displayName: 'Email Address',
          type: 'String',
          validation: {
            regex: EMAIL_REGEX,
            maxLength: EMAIL_MAX_LENGTH,
            errorMessage: EMAIL_VALIDATION_ERROR_MESSAGE
          }
        }
      }
    }
  ]
};

exports.schema = contactSchema;
exports.fieldDefinitions = fieldDefinitions;
