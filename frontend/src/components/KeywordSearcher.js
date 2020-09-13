import React from 'react';
import Container from 'react-bootstrap/Container';
import ContactCardList from './ContactCardList';

const KeywordSearcher = ({
  keyword,
  fieldDefinitions,
  contacts,
  isGettingFieldDefinitions,
  isSearchingContacts,
  isInvitingContact,
  isAdmin,
  inviteContact
}) => {

  return (
    <Container fluid>
      <ContactCardList
        fieldDefinitions={fieldDefinitions}
        searchText={keyword}
        contacts={contacts}
        isGettingFieldDefinitions={isGettingFieldDefinitions}
        isListing={isSearchingContacts}
        isInviting={isInvitingContact}
        isAdmin={isAdmin}
        inviteFunc={inviteContact} />
    </Container>
  )
}

export default KeywordSearcher;
