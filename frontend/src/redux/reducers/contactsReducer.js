import {
  ADD_CONTACT, ADD_CONTACT_ERROR, ADD_CONTACT_SUCCESS,
  INVITE_CONTACT, INVITE_CONTACT_ERROR, INVITE_CONTACT_SUCCESS,
  LIST_CONTACTS, LIST_CONTACTS_ERROR, LIST_CONTACTS_SUCCESS,
  UPDATE_CONTACT, UPDATE_CONTACT_ERROR, UPDATE_CONTACT_SUCCESS
} from '../actionTypes';

const contacts = (
  state = {
    isAddingContact: false,
    isListingContacts: false,
    isUpdatingContact: false,
    isInvitingContact: false,
    searchText: '',
    searchContacts: [],
    addContactError: null,
    listContactError: null,
    updateContactError: null,
    inviteContactError: null
  },
  action) => {
  switch (action.type) {
    case ADD_CONTACT:
      return Object.assign({}, state, { isAddingContact: true, addContactError: null });
    case ADD_CONTACT_SUCCESS:
      return Object.assign({}, state, { isAddingContact: false, addContactError: null });
    case ADD_CONTACT_ERROR:
      return Object.assign({}, state, { isAddingContact: false, addContactError: action.error });
    case LIST_CONTACTS:
      return Object.assign({}, state, { isListingContacts: true, searchText: action.searchText, updateContactError: null });
    case LIST_CONTACTS_SUCCESS:
      return Object.assign({}, state, { isListingContacts: false, searchText: action.searchText, searchContacts: action.contacts, updateContactError: null });
    case LIST_CONTACTS_ERROR:
      return Object.assign({}, state, { isListingContacts: false, updateContactError: action.error });
    case UPDATE_CONTACT:
      return Object.assign({}, state, { isUpdatingContact: true, updateContactError: null });
    case UPDATE_CONTACT_SUCCESS:
      return Object.assign({}, state, { isUpdatingContact: false, profileContact: action.contact, updateContactError: null });
    case UPDATE_CONTACT_ERROR:
      return Object.assign({}, state, { isUpdatingContact: false, updateContactError: action.error });
    case INVITE_CONTACT:
      return Object.assign({}, state, { isInvitingContact: true, inviteContactError: null });
    case INVITE_CONTACT_SUCCESS:
      return Object.assign({}, state, { isInvitingContact: false, inviteContactError: null });
    case INVITE_CONTACT_ERROR:
      return Object.assign({}, state, { isInvitingContact: false, inviteContactError: action.error });
    default:
      return state;
  }
}

export default contacts;
