/** @format */

import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useHistory } from 'react-router-dom';
import { ADMIN_VIEW_CONTACT_SEARCH_BY_NAME_PATH } from '../OnlineDirectoryApp';
import ContactCard from './ContactCard';
import PageRefresher from './PageRefresher';

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
  addContact,
  listAllContacts
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const history = useHistory();

  if (isGettingFieldDefinitions || isGettingContact) {
    return <Spinner animation='border' variant='primary' />;
  }

  if (mode === 'View' || mode === 'Edit') {
    return (
      contact && (
        <Container>
          <Row className='justify-content-center'>
            <PageRefresher />
          </Row>
          <Row className='justify-content-center'>
            <ContactCard
              width={'25rem'}
              fieldDefinitions={fieldDefinitions}
              editable={editable}
              contact={contact}
              isAdmin={isAdmin}
              isSaving={isUpdatingContact}
              isInviting={isInvitingContact}
              saveFunc={updateContact}
              inviteFunc={inviteContact}
            />
          </Row>
        </Container>
      )
    );
  }

  return (
    <ContactCard
      width={'25rem'}
      fieldDefinitions={fieldDefinitions}
      editable={true}
      isSaving={isAddingContact}
      saveFunc={addContact}
      redirectAfterSave={(savedContact) => {
        getAccessTokenSilently()
          .then((token) => listAllContacts(token))
          .then(() =>
            history.push(
              `${ADMIN_VIEW_CONTACT_SEARCH_BY_NAME_PATH}?id=${savedContact[fieldDefinitions.idField.propName]}`
            )
          );
      }}
    />
  );
};

export default ContactLoader;
