const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => console.log(`Established connection to MongoDB on host ${result.connection.host}:${result.connection.port} with user ${result.connection.user}`))
  .catch(err => console.error(err));

const contactSchema = require('./schema/contactSchema');
const Contact = mongoose.model('Contact', contactSchema);

// Add contact
const addContact = (contact, done) => {
  new Contact(contact).save((err, data) => {
    if (err) return done(err);
    done(null, data);
  });
}

// Get contact by ID
const getContactById = (contactId, done) => {
  Contact.findById(
    contactId,
    (err, data) => {
      if (err) return done(err);
      done(null, data);
    }
  );
}

// Get contact by IDP subject
const getContactByIdpSubject = (idpSub, done) => {
  Contact.findOne(
    { idpSubject: idpSub },
    (err, data) => {
      if (err) return done(err);
      done(null, data);
    }
  );
}

// Update contact by ID
const updateContact = (contactId, contact, done) => {
  Contact.findByIdAndUpdate(
    contactId,
    contact,
    { new: true, useFindAndModify: false },
    (err, data) => {
      if (err) return done(err);
      done(null, data);
    }
  );
}

// List contacts by keyword
const listContactsByKeyword = (keyword, done) => {
  Contact.find(
    keyword === ':all:' ?
      {} :
      {
        $or: [
          { name: new RegExp(keyword, 'i') },
          { address: new RegExp(keyword, 'i') },
          { phoneNumber: new RegExp(keyword, 'i') }
        ]
      },
    (err, data) => {
      if (err) return done(err);
      done(null, data);
    }
  );
}

exports.addContact = addContact;
exports.getContactById = getContactById;
exports.getContactByIdpSubject = getContactByIdpSubject;
exports.updateContact = updateContact;
exports.listContactsByKeyword = listContactsByKeyword;
