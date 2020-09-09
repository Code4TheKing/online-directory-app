import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import AutoSuggester from '../components/AutoSuggester';
import ContactsSearcher from '../components/ContactsSearcher';
import { useGetContactById, useListAllContacts, useListAllContactsNameChange, useSearchContacts, useUpdateSuggestInput } from '../hooks/useContacts';
import usePrevious from '../hooks/usePrevious';
import useQuery from '../hooks/useQuery';
import { SEARCH_BY_KEYWORD_PATH, SEARCH_BY_NAME_PATH } from '../OnlineDirectoryApp';
import { resetContact, resetSearchContacts } from '../redux/actionCreators';
import { getContactAsync, inviteContactAsync, listAllContactsAsync, searchContactsAsync, updateContactAsync } from '../redux/actions';
import '../styles/search.css';
import KeywordSearcher from '../components/KeywordSearcher';

const Search = ({
  fieldDefinitions,
  contact,
  searchContactList,
  allContacts,
  isGettingFieldDefinitions,
  isGettingContact,
  isUpdatingContact,
  isListingAllContacts,
  isInvitingContact,
  isSearchingContacts,
  isAdmin,
  getContact,
  updateContact,
  inviteContact,
  resetContact,
  listAllContacts,
  searchContacts,
  resetSearchContacts
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const query = useQuery();
  const history = useHistory();
  const previousContact = usePrevious(contact);
  const [suggestInput, setSuggestInput] = useState('');
  const [keyword] = useState(query.get('text') ? query.get('text') : '');
  const [contactId] = useState(query.get('id') ? query.get('id') : '');

  useListAllContacts(allContacts, getAccessTokenSilently, listAllContacts);
  useListAllContactsNameChange(contact, previousContact, fieldDefinitions, getAccessTokenSilently, listAllContacts);
  useUpdateSuggestInput(contact, keyword, fieldDefinitions, setSuggestInput);
  useGetContactById(contactId, getAccessTokenSilently, getContact, resetContact);
  useSearchContacts(keyword, getAccessTokenSilently, searchContacts, resetSearchContacts);

  return (
    <>
      <Row className="justify-content-center">
        <h2>Search</h2>
      </Row>
      <Row className="justify-content-center mt-3">
        <AutoSuggester
          input={suggestInput}
          fieldDefinitions={fieldDefinitions}
          allContacts={allContacts}
          isListingAllContacts={isListingAllContacts}
          suggestionRedirect={(contactId) => history.push(`${SEARCH_BY_NAME_PATH}?id=${contactId}`)}
          searchRedirect={(input) => history.push(`${SEARCH_BY_KEYWORD_PATH}?text=${input}`)} />
      </Row>
      <Row className="justify-content-center mt-3">
        <Switch>
          <Route path={`${SEARCH_BY_NAME_PATH}`}>
            <ContactsSearcher
              contactId={contactId}
              fieldDefinitions={fieldDefinitions}
              contact={contact}
              isGettingFieldDefinitions={isGettingFieldDefinitions}
              isGettingContact={isGettingContact}
              isUpdatingContact={isUpdatingContact}
              isListingAllContacts={isListingAllContacts}
              isInvitingContact={isInvitingContact}
              isAdmin={isAdmin}
              getContact={getContact}
              updateContact={updateContact}
              inviteContact={inviteContact}
              resetContact={resetContact}
              listAllContacts={listAllContacts} />
          </Route>
          <Route path={`${SEARCH_BY_KEYWORD_PATH}`}>
            <KeywordSearcher
              keyword={keyword}
              fieldDefinitions={fieldDefinitions}
              contacts={searchContactList}
              isGettingFieldDefinitions={isGettingFieldDefinitions}
              isSearchingContacts={isSearchingContacts}
              isInvitingContact={isInvitingContact}
              isAdmin={isAdmin}
              inviteContact={inviteContact} />
          </Route>
        </Switch>
      </Row>
    </>
  );
}

const mapStateToProps = (state) => ({
  fieldDefinitions: state.contacts.fieldDefinitions,
  contact: state.contacts.contact,
  searchContactList: state.contacts.searchContacts,
  allContacts: state.contacts.allContacts,
  isGettingFieldDefinitions: state.contacts.isGettingFieldDefinitions,
  isGettingContact: state.contacts.isGettingContact,
  isUpdatingContact: state.contacts.isUpdatingContact,
  isListingAllContacts: state.contacts.isListingAllContacts,
  isInvitingContact: state.contacts.isInvitingContact,
  isSearchingContacts: state.contacts.isSearchingContacts,
  isAdmin: state.profileContacts.isAdmin
});

const mapDispatchToProps = (dispatch) => ({
  getContact: (contactId, token) => dispatch(getContactAsync(contactId, token)),
  updateContact: (fieldDefinitions, contact, pictureFile, token) =>
    dispatch(updateContactAsync(fieldDefinitions, contact, pictureFile, token)),
  inviteContact: (fieldDefinitions, contact, email, token) =>
    dispatch(inviteContactAsync(fieldDefinitions, contact, email, token)),
  resetContact: () => dispatch(resetContact()),
  listAllContacts: (token) => dispatch(listAllContactsAsync(token)),
  searchContacts: (searchText, token) => dispatch(searchContactsAsync(searchText, token)),
  resetSearchContacts: () => dispatch(resetSearchContacts())
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
