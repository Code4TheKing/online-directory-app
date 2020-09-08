import React from 'react';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ContactCardList from '../../components/ContactCardList';
import SearchBar from '../../components/SearchBar';
import useQuery from '../../hooks/useQuery';
import { SEARCH_BY_KEYWORD_PATH } from '../../OnlineDirectoryApp';
import { resetSearchContacts } from '../../redux/actionCreators';
import { inviteContactAsync, searchContactsAsync } from '../../redux/actions';

const SearchByKeyword = ({
  fieldDefinitions,
  contacts,
  isGettingFieldDefinitions,
  isSearchingContacts,
  isInvitingContact,
  isAdmin,
  searchContacts,
  resetSearchContacts,
  inviteContact
}) => {
  const query = useQuery();
  const keyword = query.get('text') ? query.get('text') : '';
  const history = useHistory();

  return (
    <>
      <Row className="justify-content-center mb-2">
        <h2>Search By Keyword</h2>
      </Row>
      <Row className="justify-content-center mb-3">
        <SearchBar
          searchText={keyword}
          searchFunc={searchContacts}
          resetSearch={resetSearchContacts}
          redirectOnSearch={(input) => history.push(`${SEARCH_BY_KEYWORD_PATH}?text=${input}`)} />
      </Row>
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
    </>
  )
}

const mapStateToProps = (state) => ({
  fieldDefinitions: state.contacts.fieldDefinitions,
  contacts: state.contacts.searchContacts,
  isGettingFieldDefinitions: state.contacts.isGettingFieldDefinitions,
  isSearchingContacts: state.contacts.isSearchingContacts,
  isInvitingContact: state.contacts.isInvitingContact,
  isAdmin: state.profileContacts.isAdmin
});

const mapDispatchToProps = (dispatch) => ({
  searchContacts: (searchText, token) => dispatch(searchContactsAsync(searchText, token)),
  resetSearchContacts: () => dispatch(resetSearchContacts()),
  inviteContact: (fieldDefinitions, contact, email, token) =>
    dispatch(inviteContactAsync(fieldDefinitions, contact, email, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchByKeyword);
