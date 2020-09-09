import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
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
    <Container>
      <Row className="justify-content-center">
        <ContactCardList
          fieldDefinitions={fieldDefinitions}
          searchText={keyword}
          contacts={contacts}
          isGettingFieldDefinitions={isGettingFieldDefinitions}
          isListing={isSearchingContacts}
          isInviting={isInvitingContact}
          isAdmin={isAdmin}
          inviteFunc={inviteContact} />
      </Row>
    </Container>
  )
}

export default KeywordSearcher;
