/** @format */

import React from 'react';
import ContactLoader from './ContactLoader';

const ContactEditor = ({
  fieldDefinitions,
  contact,
  isGettingFieldDefinitions,
  isGettingContact,
  isUpdatingContact,
  isInvitingContact,
  isAdmin,
  updateContact,
  inviteContact
}) => {
  return (
    <ContactLoader
      mode='Edit'
      fieldDefinitions={fieldDefinitions}
      contact={contact}
      editable={true}
      isGettingFieldDefinitions={isGettingFieldDefinitions}
      isGettingContact={isGettingContact}
      isUpdatingContact={isUpdatingContact}
      isInvitingContact={isInvitingContact}
      isAdmin={isAdmin}
      updateContact={updateContact}
      inviteContact={inviteContact}
    />
  );
};

export default ContactEditor;
