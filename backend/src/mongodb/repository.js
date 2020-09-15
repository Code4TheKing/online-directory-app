/** @format */

const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    console.log(
      `Established connection to MongoDB on host ${result.connection.host}:${result.connection.port} with user ${result.connection.user}`
    )
  )
  .catch((err) => console.error(err));

const contactSchema = require('./schema/contactSchema');
const Contact = mongoose.model('Contact', contactSchema.schema);

// Add contact
const addContact = (contact) => {
  return new Contact(contact).save().then((savedContact) => {
    if (!savedContact) {
      throw new Error('Something went wrong. Could not add contact for the given input.');
    }
    return savedContact;
  });
};

// Get contact by ID
const getContactById = (contactId) => {
  return Contact.findById(contactId).then((existingContact) => {
    if (!existingContact) {
      const notFoundError = new Error(`No contact found for ID ${contactId}`);
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    return existingContact;
  });
};

// Get contact by IDP subject
const getContactByIdpSubject = (idpSub, lean = false) => {
  return Contact.findOne({ idpSubject: idpSub })
    .lean(lean)
    .then((contact) => {
      if (!contact) {
        const notFoundError = new Error(`There is no profile contact for IDP sub ${idpSub}. Create one first.`);
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      return contact;
    });
};

// Update contact by ID
const updateContact = (contactId, contact, lean = false) => {
  return Contact.findByIdAndUpdate(contactId, contact, { new: true, useFindAndModify: false, runValidators: true })
    .lean(lean)
    .then((updatedContact) => {
      if (!updatedContact) {
        throw new Error('Something went wrong. Could not update contact for the given input.');
      }
      return updatedContact;
    });
};

// List contacts by keyword
const listContactsByKeyword = (keyword) => {
  return Contact.find(
    keyword === ':all:'
      ? {}
      : {
          $or: [
            { name: new RegExp(keyword, 'i') },
            { address: new RegExp(keyword, 'i') },
            { phoneNumber: new RegExp(keyword, 'i') }
          ]
        }
  );
};

exports.addContact = addContact;
exports.getContactById = getContactById;
exports.getContactByIdpSubject = getContactByIdpSubject;
exports.updateContact = updateContact;
exports.listContactsByKeyword = listContactsByKeyword;
