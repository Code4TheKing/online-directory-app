/** @format */

import React from 'react';
import Container from 'react-bootstrap/Container';
import ContactCardList from './ContactCardList';

const KeywordSearcher = ({
  keyword,
  fieldDefinitions,
  contacts,
  linkedUsers,
  isGettingFieldDefinitions,
  isSearchingContacts,
  isInvitingContact,
  isListingLinkedUsers,
  isAdmin,
  inviteContact,
  listLinkedUsers
}) => {
  return (
    <Container fluid>
      <ContactCardList
        fieldDefinitions={fieldDefinitions}
        searchText={keyword}
        contacts={contacts}
        linkedUsers={linkedUsers}
        isGettingFieldDefinitions={isGettingFieldDefinitions}
        isListing={isSearchingContacts}
        isInviting={isInvitingContact}
        isListingLinkedUsers={isListingLinkedUsers}
        isAdmin={isAdmin}
        inviteFunc={inviteContact}
        listLinkedUsersFunc={listLinkedUsers}
      />
    </Container>
  );
};

export default KeywordSearcher;
