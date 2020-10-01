/** @format */

import React from 'react';
import ContactLoader from './ContactLoader';

const ContactViewer = ({
  fieldDefinitions,
  contact,
  linkedUsers,
  profileContact,
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
      mode='View'
      fieldDefinitions={fieldDefinitions}
      contact={contact}
      linkedUsers={linkedUsers}
      profileContact={profileContact}
      editable={false}
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

export default ContactViewer;
