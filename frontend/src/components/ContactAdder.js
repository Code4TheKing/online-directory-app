/** @format */

import React from 'react';
import ContactLoader from './ContactLoader';

const ContactAdder = ({
  fieldDefinitions,
  isGettingFieldDefinitions,
  isAddingContact,
  isAdmin,
  addContact,
  listAllContacts
}) => {
  return (
    <ContactLoader
      mode='Add'
      fieldDefinitions={fieldDefinitions}
      editable={true}
      isGettingFieldDefinitions={isGettingFieldDefinitions}
      isAddingContact={isAddingContact}
      isAdmin={isAdmin}
      addContact={addContact}
      listAllContacts={listAllContacts}
    />
  );
};

export default ContactAdder;
