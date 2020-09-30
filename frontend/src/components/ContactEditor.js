/** @format */

import React from 'react';
import ContactLoader from './ContactLoader';

const ContactEditor = ({
  fieldDefinitions,
  contact,
  linkedUsers,
  isGettingFieldDefinitions,
  isGettingContact,
  isUpdatingContact,
  isInvitingContact,
  isListingLinkedUsers,
  isAdmin,
  updateContact,
  inviteContact,
  listLinkedUsers
}) => {
  return (
    <ContactLoader
      mode='Edit'
      fieldDefinitions={fieldDefinitions}
      contact={contact}
      linkedUsers={linkedUsers}
      editable={true}
      isGettingFieldDefinitions={isGettingFieldDefinitions}
      isGettingContact={isGettingContact}
      isUpdatingContact={isUpdatingContact}
      isInvitingContact={isInvitingContact}
      isListingLinkedUsers={isListingLinkedUsers}
      isAdmin={isAdmin}
      updateContact={updateContact}
      inviteContact={inviteContact}
      listLinkedUsers={listLinkedUsers}
    />
  );
};

export default ContactEditor;
