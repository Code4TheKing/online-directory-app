import React from 'react';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import ContactCardList from '../components/ContactCardList';
import SearchBar from '../components/SearchBar';
import { listContactsByKeywordAsync, updateContactAsync } from '../redux/actions';

const Search = ({ searchText, contacts, isListingContacts, listContactsByKeyword, updateContact }) => {

  return (
    <div className="mx-5">
      <Row className="justify-content-center">
        <SearchBar searchFunc={listContactsByKeyword} />
      </Row>
      <Row className="justify-content-center mt-5">
        <ContactCardList searchText={searchText} contacts={contacts} isListing={isListingContacts} saveFunc={updateContact} />
      </Row>
    </div>
  )
}

const mapStateToProps = (state) => ({
  searchText: state.contacts.searchText,
  contacts: state.contacts.contacts,
  isListingContacts: state.contacts.isListingContacts
});

const mapDispatchToProps = (dispatch) => ({
  listContactsByKeyword: (searchText, token) => dispatch(listContactsByKeywordAsync(searchText, token)),
  updateContact: (contact, token) => dispatch(updateContactAsync(contact, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
