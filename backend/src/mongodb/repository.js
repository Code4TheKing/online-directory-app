const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => console.log(`Established connection to MongoDB on host ${result.connection.host}:${result.connection.port} with user ${result.connection.user}`))
  .catch(err => console.error(err));

const contactSchema = require('./schema/contact');
const Contact = mongoose.model('Contact', contactSchema);

// Add contact
const addContact = (contact, done) => {
  contact.save((err, data) => {
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
};

exports.ContactModel = Contact;
exports.addContact = addContact;
exports.getContactById = getContactById;
exports.updateContact = updateContact;
