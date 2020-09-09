import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { SEARCH_BY_NAME_PATH } from '../OnlineDirectoryApp';
import ContactCard from './ContactCard';

const ContactLoader = ({
  mode, // View, Edit, or Add
  fieldDefinitions,
  contact,
  editable,
  isGettingFieldDefinitions,
  isGettingContact,
  isUpdatingContact,
  isInvitingContact,
  isAddingContact,
  isAdmin,
  updateContact,
  inviteContact,
  addContact
}) => {
  const history = useHistory();

  if (isGettingFieldDefinitions || isGettingContact) {
    return <CircularProgress />;
  }

  if (mode === 'View' || mode === 'Edit') {
    return (
      contact && <ContactCard
        fieldDefinitions={fieldDefinitions}
        editable={editable}
        contact={contact}
        isAdmin={isAdmin}
        isSaving={isUpdatingContact}
        isInviting={isInvitingContact}
        saveFunc={updateContact}
        inviteFunc={inviteContact}
        width={'25rem'} />
    );
  }

  return (
    <ContactCard
      fieldDefinitions={fieldDefinitions}
      editable={true}
      isSaving={isAddingContact}
      saveFunc={addContact}
      redirectAfterSave={(savedContact) =>
        history.push(`${SEARCH_BY_NAME_PATH}?id=${savedContact[fieldDefinitions.idField.propName]}`)}
      width={'25rem'} />
  );
}

export default ContactLoader;
