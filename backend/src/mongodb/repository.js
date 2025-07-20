/** @format */

const mongoose = require('mongoose');
const connectionPromise = mongoose
  .connect(process.env.API_MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    console.log(
      `Established connection to MongoDB on host ${result.connection.host}:${result.connection.port} with user ${result.connection.user}`
    )
  )
  .catch((err) => {
    console.error(err);
    throw err;
  });
const errors = require('../utils/errors');

const contactSchema = require('./schema/contactSchema');
const Contact = mongoose.model('Contact', contactSchema.schema);

// Add contact
const addContact = async (contact) => {
  await connectionPromise;
  console.log('Adding contact with data:', contact.firstName, contact.lastName);
  const savedContact = await new Contact(contact).save();
  if (!savedContact) {
    throw new Error('Something went wrong. Could not add contact for the given input.');
  }
  return savedContact;
};

// Get contact by ID
const getContactById = async (contactId) => {
  await connectionPromise;
  const existingContact = await Contact.findById(contactId);
  if (!existingContact) {
    throw errors.generateError(`No contact found for ID ${contactId}`, 404);
  }
  return existingContact;
};

// Get contact by IDP subject
const getContactByIdpSubject = async (idpSub, lean = false) => {
  await connectionPromise;
  const contact = await Contact.findOne({ idpSubjects: idpSub }).lean(lean);
  if (!contact) {
    throw errors.generateError(`There is no profile contact for IDP sub ${idpSub}. Create one first.`, 404);
  }
  return contact;
};

// Update contact by ID
const updateContact = async (contactId, contact, lean = false) => {
  await connectionPromise;
  console.log(`Updating contact with ID ${contactId} with data:`, contact.firstName, contact.lastName);
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    contact,
    { new: true, useFindAndModify: false, runValidators: true }
  ).lean(lean);
  if (!updatedContact) {
    throw new Error('Something went wrong. Could not update contact for the given input.');
  }
  return updatedContact;
}

// List contacts by keyword
const listContactsByKeyword = async (keyword) => {
  await connectionPromise;
  const escapedKeyword = escapeRegexCharacters(keyword);
  return Contact.find(
    escapedKeyword === ':all:'
      ? {}
      : {
          $or: [
            { firstName: new RegExp(escapedKeyword, 'i') },
            { lastName: new RegExp(escapedKeyword, 'i') },
            { familyMembers: new RegExp(escapedKeyword, 'i') },
            { address: new RegExp(escapedKeyword, 'i') },
            { 'contact.name': new RegExp(escapedKeyword, 'i') },
            { 'contact.phoneNumber': new RegExp(escapedKeyword, 'i') },
            { 'contact.emailAddress': new RegExp(escapedKeyword, 'i') }
          ]
        }
  ).sort('lastName');
};

const escapeRegexCharacters = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

exports.addContact = addContact;
exports.getContactById = getContactById;
exports.getContactByIdpSubject = getContactByIdpSubject;
exports.updateContact = updateContact;
exports.listContactsByKeyword = listContactsByKeyword;
