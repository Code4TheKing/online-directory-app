import React from 'react';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import ContactCardList from '../components/ContactCardList';
import SearchBar from '../components/SearchBar';
import { inviteContactAsync, listContactsByKeywordAsync } from '../redux/actions';

const Search = ({
  fieldDefinitions,
  searchText,
  contacts,
  isGettingFieldDefinitions,
  isListingContacts,
  isInvitingContact,
  isAdmin,
  listContactsByKeyword,
  inviteContact
}) => {

  return (
    <div className="mx-5">
      <Row className="justify-content-center">
        <SearchBar searchFunc={listContactsByKeyword} />
      </Row>
      <Row className="justify-content-center mt-5">
        <ContactCardList
          fieldDefinitions={fieldDefinitions}
          searchText={searchText}
          contacts={contacts}
          isGettingFieldDefinitions={isGettingFieldDefinitions}
          isListing={isListingContacts}
          isInviting={isInvitingContact}
          isAdmin={isAdmin}
          inviteFunc={inviteContact} />
      </Row>
    </div>
  )
}

const mapStateToProps = (state) => ({
  fieldDefinitions: state.contacts.fieldDefinitions,
  searchText: state.contacts.searchText,
  contacts: state.contacts.searchContacts,
  isGettingFieldDefinitions: state.contacts.isGettingFieldDefinitions,
  isListingContacts: state.contacts.isListingContacts,
  isInvitingContact: state.contacts.isInvitingContact,
  isAdmin: state.profileContacts.isAdmin
});

const mapDispatchToProps = (dispatch) => ({
  listContactsByKeyword: (searchText, token) => dispatch(listContactsByKeywordAsync(searchText, token)),
  inviteContact: (fieldDefinitions, contact, email, token) => dispatch(inviteContactAsync(fieldDefinitions, contact, email, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
