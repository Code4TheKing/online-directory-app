import React from 'react';
import ContactLoader from './ContactLoader';

const ContactViewer = ({
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
      mode='View'
      fieldDefinitions={fieldDefinitions}
      contact={contact}
      editable={false}
      isGettingFieldDefinitions={isGettingFieldDefinitions}
      isGettingContact={isGettingContact}
      isUpdatingContact={isUpdatingContact}
      isInvitingContact={isInvitingContact}
      isAdmin={isAdmin}
      updateContact={updateContact}
      inviteContact={inviteContact} />
  );
}

export default ContactViewer;
