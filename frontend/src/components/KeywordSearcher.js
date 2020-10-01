/** @format */

import React from 'react';
import Container from 'react-bootstrap/Container';
import ContactCardList from './ContactCardList';

const KeywordSearcher = ({
  keyword,
  fieldDefinitions,
  contacts,
  linkedUsers,
  profileContact,
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
        profileContact={profileContact}
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
