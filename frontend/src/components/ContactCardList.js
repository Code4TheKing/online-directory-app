import { CircularProgress } from '@material-ui/core';
import React from 'react';
import CardColumns from 'react-bootstrap/CardColumns';
import Container from 'react-bootstrap/Container';
import '../styles/contact-card-list.scss';
import ContactCard from './ContactCard';

const ContactCardList = ({
  fieldDefinitions,
  searchText,
  contacts,
  isGettingFieldDefinitions,
  isListing,
  isInviting,
  isAdmin = false,
  saveFunc,
  inviteFunc
}) => {

  return (
    <Container className="d-flex justify-content-center px-3" style={!isListing && contacts.length > 0 ? { borderWidth: '1px', borderStyle: 'dashed' } : {}}>
      {
        isGettingFieldDefinitions || isListing ?
          <CircularProgress /> :
          contacts.length > 0 ?
            <CardColumns className="mt-3">
              {
                contacts.map(contact =>
                  <ContactCard
                    fieldDefinitions={fieldDefinitions}
                    key={contact._id}
                    contact={contact}
                    isInviting={isInviting}
                    isAdmin={isAdmin}
                    saveFunc={saveFunc}
                    inviteFunc={inviteFunc} />)
              }
            </CardColumns> :
            searchText ?
              <p className="text-center text-info my-2">No contacts found for the given search text</p> :
              <p className="text-center text-info my-2">Use the search to display some contacts</p>
      }
    </Container>
  );
}

export default ContactCardList;
