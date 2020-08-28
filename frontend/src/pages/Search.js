import React from 'react';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import ContactCardList from '../components/ContactCardList';
import SearchBar from '../components/SearchBar';
import { inviteContactAsync, listContactsByKeywordAsync, updateContactAsync } from '../redux/actions';

const Search = ({ searchText, contacts, isListingContacts, isInvitingContact, isAdmin, listContactsByKeyword, updateContact, inviteContact }) => {

  return (
    <div className="mx-5">
      <Row className="justify-content-center">
        <SearchBar searchFunc={listContactsByKeyword} />
      </Row>
      <Row className="justify-content-center mt-5">
        <ContactCardList
          searchText={searchText}
          contacts={contacts}
          isListing={isListingContacts}
          isInviting={isInvitingContact}
          isAdmin={isAdmin}
          saveFunc={updateContact}
          inviteFunc={inviteContact} />
      </Row>
    </div>
  )
}

const mapStateToProps = (state) => ({
  searchText: state.contacts.searchText,
  contacts: state.contacts.searchContacts,
  isListingContacts: state.contacts.isListingContacts,
  isInvitingContact: state.contacts.isInvitingContact,
  isAdmin: state.profileContacts.isAdmin
});

const mapDispatchToProps = (dispatch) => ({
  listContactsByKeyword: (searchText, token) => dispatch(listContactsByKeywordAsync(searchText, token)),
  updateContact: (contact, token) => dispatch(updateContactAsync(contact, token)),
  inviteContact: (contactId, email, token) => dispatch(inviteContactAsync(contactId, email, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
