/** @format */

import {
  ADD_CONTACT,
  ADD_CONTACT_ERROR,
  ADD_CONTACT_SUCCESS,
  GET_CONTACT,
  GET_CONTACT_ERROR,
  GET_CONTACT_SUCCESS,
  GET_FIELD_DEFINITIONS,
  GET_FIELD_DEFINITIONS_ERROR,
  GET_FIELD_DEFINITIONS_SUCCESS,
  INVITE_CONTACT,
  INVITE_CONTACT_ERROR,
  INVITE_CONTACT_SUCCESS,
  LIST_ALL_CONTACTS,
  LIST_ALL_CONTACTS_ERROR,
  LIST_ALL_CONTACTS_SUCCESS,
  LIST_USERS_FOR_CONTACT,
  LIST_USERS_FOR_CONTACT_ERROR,
  LIST_USERS_FOR_CONTACT_SUCCESS,
  RESET_CONTACT,
  RESET_SEARCH_CONTACTS,
  SEARCH_CONTACTS,
  SEARCH_CONTACTS_ERROR,
  SEARCH_CONTACTS_SUCCESS,
  UPDATE_CONTACT,
  UPDATE_CONTACT_ERROR,
  UPDATE_CONTACT_SUCCESS
} from '../actionTypes';

const contacts = (
  state = {
    isGettingFieldDefinitions: false,
    isAddingContact: false,
    isGettingContact: false,
    isSearchingContacts: false,
    isListingAllContacts: false,
    isListingUsersForContact: false,
    isUpdatingContact: false,
    isInvitingContact: false,
    fieldDefinitions: {},
    contact: null,
    searchText: '',
    searchContacts: [],
    allContacts: null,
    linkedUsers: [],
    getFieldDefinitionsError: null,
    addContactError: null,
    getContactError: null,
    searchContactsError: null,
    listAllContactsError: null,
    listUsersForContactError: null,
    updateContactError: null,
    inviteContactError: null
  },
  action
) => {
  switch (action.type) {
    case ADD_CONTACT:
      return Object.assign({}, state, { isAddingContact: true, addContactError: null });
    case ADD_CONTACT_SUCCESS:
      return Object.assign({}, state, { isAddingContact: false, addContactError: null });
    case ADD_CONTACT_ERROR:
      return Object.assign({}, state, { isAddingContact: false, addContactError: action.error });
    case GET_CONTACT:
      return Object.assign({}, state, { isGettingContact: true, getContactError: null });
    case GET_CONTACT_SUCCESS:
      return Object.assign({}, state, { isGettingContact: false, contact: action.contact, getContactError: null });
    case GET_CONTACT_ERROR:
      return Object.assign({}, state, { isGettingContact: false, getContactError: action.error });
    case RESET_CONTACT:
      return Object.assign({}, state, { contact: null });
    case SEARCH_CONTACTS:
      return Object.assign({}, state, {
        isSearchingContacts: true,
        searchText: action.searchText,
        searchContactsError: null
      });
    case SEARCH_CONTACTS_SUCCESS:
      return Object.assign({}, state, {
        isSearchingContacts: false,
        searchText: action.searchText,
        searchContacts: action.contacts,
        searchContactsError: null
      });
    case SEARCH_CONTACTS_ERROR:
      return Object.assign({}, state, { isSearchingContacts: false, searchContactsError: action.error });
    case RESET_SEARCH_CONTACTS:
      return Object.assign({}, state, { searchContacts: [] });
    case LIST_ALL_CONTACTS:
      return Object.assign({}, state, { isListingAllContacts: true, listAllContactsError: null });
    case LIST_ALL_CONTACTS_SUCCESS:
      return Object.assign({}, state, {
        isListingAllContacts: false,
        allContacts: action.contacts,
        listAllContactsError: null
      });
    case LIST_ALL_CONTACTS_ERROR:
      return Object.assign({}, state, { isListingAllContacts: false, listAllContactsError: action.error });
    case LIST_USERS_FOR_CONTACT:
      return Object.assign({}, state, { isListingUsersForContact: true, listUsersForContactError: null });
    case LIST_USERS_FOR_CONTACT_SUCCESS:
      return Object.assign({}, state, {
        isListingUsersForContact: false,
        linkedUsers: action.users,
        listUsersForContactError: null
      });
    case LIST_USERS_FOR_CONTACT_ERROR:
      return Object.assign({}, state, { isListingUsersForContact: false, listUsersForContactError: action.error });
    case UPDATE_CONTACT:
      return Object.assign({}, state, { isUpdatingContact: true, updateContactError: null });
    case UPDATE_CONTACT_SUCCESS:
      return Object.assign({}, state, { isUpdatingContact: false, contact: action.contact, updateContactError: null });
    case UPDATE_CONTACT_ERROR:
      return Object.assign({}, state, { isUpdatingContact: false, updateContactError: action.error });
    case INVITE_CONTACT:
      return Object.assign({}, state, { isInvitingContact: true, inviteContactError: null });
    case INVITE_CONTACT_SUCCESS:
      return Object.assign({}, state, { isInvitingContact: false, inviteContactError: null });
    case INVITE_CONTACT_ERROR:
      return Object.assign({}, state, { isInvitingContact: false, inviteContactError: action.error });
    case GET_FIELD_DEFINITIONS:
      return Object.assign({}, state, { isGettingFieldDefinitions: true, getFieldDefinitionsError: null });
    case GET_FIELD_DEFINITIONS_SUCCESS:
      return Object.assign({}, state, {
        isGettingFieldDefinitions: false,
        fieldDefinitions: action.fieldDefinitions,
        getFieldDefinitionsError: null
      });
    case GET_FIELD_DEFINITIONS_ERROR:
      return Object.assign({}, state, { isGettingFieldDefinitions: false, getFieldDefinitionsError: action.error });
    default:
      return state;
  }
};

export default contacts;
