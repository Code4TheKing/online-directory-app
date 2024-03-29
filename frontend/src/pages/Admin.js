/** @format */

import { useAuth0 } from '@auth0/auth0-react';
import React, { Fragment, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import AutoSuggester from '../components/AutoSuggester';
import ContactAdder from '../components/ContactAdder';
import ContactEditor from '../components/ContactEditor';
import ContactViewer from '../components/ContactViewer';
import KeywordSearcher from '../components/KeywordSearcher';
import {
  useGetContactById,
  useListAllContacts,
  useListAllContactsNameChange,
  useSearchContacts,
  useUpdateSuggestInput
} from '../hooks/useContacts';
import usePrevious from '../hooks/usePrevious';
import useQuery from '../hooks/useQuery';
import {
  ADMIN_ADD_CONTACT_PATH,
  ADMIN_EDIT_CONTACT_PATH,
  ADMIN_VIEW_CONTACT_PATH,
  ADMIN_VIEW_CONTACT_SEARCH_BY_KEYWORD_PATH,
  ADMIN_VIEW_CONTACT_SEARCH_BY_NAME_PATH
} from '../OnlineDirectoryApp';
import { resetContact, resetSearchContacts } from '../redux/actionCreators';
import {
  addContactAsync,
  getContactAsync,
  inviteContactAsync,
  listAllContactsAsync,
  listUsersForContactAsync,
  searchContactsAsync,
  updateContactAsync
} from '../redux/actions';
import '../styles/admin.css';
import NotFound from './NotFound';

const Admin = ({
  fieldDefinitions,
  contact,
  searchContactList,
  allContacts,
  linkedUsers,
  profileContact,
  isGettingFieldDefinitions,
  isGettingContact,
  isUpdatingContact,
  isListingAllContacts,
  isInvitingContact,
  isSearchingContacts,
  isAddingContact,
  isListingLinkedUsers,
  isAdmin,
  getContact,
  updateContact,
  inviteContact,
  addContact,
  resetContact,
  listAllContacts,
  searchContacts,
  resetSearchContacts,
  listLinkedUsers
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const { path } = useRouteMatch();
  const query = useQuery();
  const history = useHistory();
  const previousContact = usePrevious(contact);
  const [suggestInput, setSuggestInput] = useState('');
  const [keyword] = useState(query.get('text') ? query.get('text') : '');
  const [contactId] = useState(query.get('id') ? query.get('id') : '');

  useListAllContacts(allContacts, getAccessTokenSilently, listAllContacts);
  useListAllContactsNameChange(contact, previousContact, fieldDefinitions, getAccessTokenSilently, listAllContacts);
  useUpdateSuggestInput(contact, keyword, fieldDefinitions, setSuggestInput, true);
  useGetContactById(contactId, getAccessTokenSilently, getContact, resetContact);
  useSearchContacts(keyword, getAccessTokenSilently, searchContacts, resetSearchContacts);

  if (!isAdmin) {
    return <NotFound />;
  }

  const keywordSearcher = (
    <KeywordSearcher
      keyword={keyword}
      fieldDefinitions={fieldDefinitions}
      contacts={searchContactList}
      linkedUsers={linkedUsers}
      profileContact={profileContact}
      isGettingFieldDefinitions={isGettingFieldDefinitions}
      isSearchingContacts={isSearchingContacts}
      isInvitingContact={isInvitingContact}
      isListingLinkedUsers={isListingLinkedUsers}
      isAdmin={isAdmin}
      inviteContact={inviteContact}
      listLinkedUsers={listLinkedUsers}
    />
  );

  return (
    <Fragment>
      <Row className='justify-content-center'>
        <Nav variant='pills' defaultActiveKey='name'>
          <Nav.Item>
            <LinkContainer to={`${ADMIN_ADD_CONTACT_PATH}`}>
              <Nav.Link eventKey='name' active={path === ADMIN_ADD_CONTACT_PATH}>
                Add
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
          <Nav.Item>
            <LinkContainer to={`${ADMIN_EDIT_CONTACT_PATH}`}>
              <Nav.Link eventKey='edit' active={path === ADMIN_EDIT_CONTACT_PATH}>
                Edit
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
          <Nav.Item>
            <LinkContainer to={`${ADMIN_VIEW_CONTACT_PATH}`}>
              <Nav.Link eventKey='view' active={path === ADMIN_VIEW_CONTACT_PATH}>
                View
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
        </Nav>
      </Row>
      <Switch>
        {/* Add Contact */}
        <Route path={`${ADMIN_ADD_CONTACT_PATH}`}>
          <Row className='justify-content-center border-dark pt-3' style={{ borderTop: '1px solid var(--dark)' }}>
            <h2>Add Contact</h2>
          </Row>
          <Row className='justify-content-center mt-3'>
            <ContactAdder
              fieldDefinitions={fieldDefinitions}
              isGettingFieldDefinitions={isGettingFieldDefinitions}
              isAddingContact={isAddingContact}
              isAdmin={isAddingContact}
              addContact={addContact}
              listAllContacts={listAllContacts}
            />
          </Row>
        </Route>
        {/* Edit Contact */}
        <Route path={`${ADMIN_EDIT_CONTACT_PATH}`}>
          <Row className='justify-content-center border-dark pt-3' style={{ borderTop: '1px solid var(--dark)' }}>
            <h2>Edit Contact</h2>
          </Row>
          <Row className='justify-content-center mt-3'>
            <AutoSuggester
              input={suggestInput}
              fieldDefinitions={fieldDefinitions}
              allContacts={allContacts}
              isListingAllContacts={isListingAllContacts}
              suggestionRedirect={(contactId) => history.push(`${ADMIN_EDIT_CONTACT_PATH}?id=${contactId}`)}
              searchRedirect={(input) =>
                input
                  ? history.push(`${ADMIN_VIEW_CONTACT_SEARCH_BY_KEYWORD_PATH}?text=${encodeURIComponent(input)}`)
                  : history.push(`${ADMIN_VIEW_CONTACT_PATH}`)
              }
            />
          </Row>
          <Row className='justify-content-center mt-3'>
            <ContactEditor
              fieldDefinitions={fieldDefinitions}
              contact={contact}
              linkedUsers={linkedUsers}
              profileContact={profileContact}
              isGettingFieldDefinitions={isGettingFieldDefinitions}
              isGettingContact={isGettingContact}
              isUpdatingContact={isUpdatingContact}
              isInvitingContact={isInvitingContact}
              isListingLinkedUsers={isListingLinkedUsers}
              isAdmin={isAdmin}
              updateContact={updateContact}
              inviteContact={inviteContact}
              listLinkedUsers={listLinkedUsers}
            />
          </Row>
        </Route>
        {/* View Contacts */}
        <Route path={`${ADMIN_VIEW_CONTACT_PATH}`}>
          <Row className='justify-content-center border-dark pt-3' style={{ borderTop: '1px solid var(--dark)' }}>
            <h2>View Contacts</h2>
          </Row>
          <Row className='justify-content-center mt-3'>
            <AutoSuggester
              input={suggestInput}
              fieldDefinitions={fieldDefinitions}
              allContacts={allContacts}
              isListingAllContacts={isListingAllContacts}
              suggestionRedirect={(contactId) =>
                history.push(`${ADMIN_VIEW_CONTACT_SEARCH_BY_NAME_PATH}?id=${contactId}`)
              }
              searchRedirect={(input) =>
                history.push(`${ADMIN_VIEW_CONTACT_SEARCH_BY_KEYWORD_PATH}?text=${encodeURIComponent(input)}`)
              }
            />
          </Row>
          <Switch>
            <Route path={`${ADMIN_VIEW_CONTACT_SEARCH_BY_NAME_PATH}`}>
              <Row className='justify-content-center mt-3'>
                <ContactViewer
                  contactId={contactId}
                  fieldDefinitions={fieldDefinitions}
                  contact={contact}
                  linkedUsers={linkedUsers}
                  profileContact={profileContact}
                  isGettingFieldDefinitions={isGettingFieldDefinitions}
                  isGettingContact={isGettingContact}
                  isUpdatingContact={isUpdatingContact}
                  isListingAllContacts={isListingAllContacts}
                  isInvitingContact={isInvitingContact}
                  isListingLinkedUsers={isListingLinkedUsers}
                  isAdmin={isAdmin}
                  getContact={getContact}
                  updateContact={updateContact}
                  inviteContact={inviteContact}
                  resetContact={resetContact}
                  listAllContacts={listAllContacts}
                  listLinkedUsers={listLinkedUsers}
                />
              </Row>
            </Route>
            <Route path={`${ADMIN_VIEW_CONTACT_SEARCH_BY_KEYWORD_PATH}`}>
              <Row className='justify-content-center mt-3'>{keywordSearcher}</Row>
            </Route>
            =
          </Switch>
        </Route>
        <Route>
          <Redirect to={ADMIN_ADD_CONTACT_PATH} />
        </Route>
      </Switch>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  fieldDefinitions: state.contacts.fieldDefinitions,
  contact: state.contacts.contact,
  searchContactList: state.contacts.searchContacts,
  allContacts: state.contacts.allContacts,
  linkedUsers: state.contacts.linkedUsers,
  profileContact: state.profileContacts.profileContact,
  isGettingFieldDefinitions: state.contacts.isGettingFieldDefinitions,
  isGettingContact: state.contacts.isGettingContact,
  isUpdatingContact: state.contacts.isUpdatingContact,
  isListingAllContacts: state.contacts.isListingAllContacts,
  isInvitingContact: state.contacts.isInvitingContact,
  isSearchingContacts: state.contacts.isSearchingContacts,
  isAddingContact: state.contacts.isAddingContact,
  isListingLinkedUsers: state.contacts.isListingUsersForContact,
  isAdmin: state.profileContacts.isAdmin
});

const mapDispatchToProps = (dispatch) => ({
  getContact: (contactId, token) => dispatch(getContactAsync(contactId, token)),
  updateContact: (fieldDefinitions, contact, pictureFile, token) =>
    dispatch(updateContactAsync(fieldDefinitions, contact, pictureFile, token)),
  inviteContact: (fieldDefinitions, contact, email, token) =>
    dispatch(inviteContactAsync(fieldDefinitions, contact, email, token)),
  addContact: (fieldDefinitions, contact, pictureFile, token) =>
    dispatch(addContactAsync(fieldDefinitions, contact, pictureFile, token)),
  resetContact: () => dispatch(resetContact()),
  listAllContacts: (token) => dispatch(listAllContactsAsync(token)),
  searchContacts: (searchText, token) => dispatch(searchContactsAsync(searchText, token)),
  resetSearchContacts: () => dispatch(resetSearchContacts()),
  listLinkedUsers: (contactId, token) => dispatch(listUsersForContactAsync(contactId, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
