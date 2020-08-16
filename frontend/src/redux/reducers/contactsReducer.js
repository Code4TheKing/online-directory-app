import {
  ADD_CONTACT, ADD_CONTACT_ERROR, ADD_CONTACT_SUCCESS, GET_CONTACT, GET_CONTACT_ERROR, GET_CONTACT_SUCCESS,
  LIST_CONTACTS, LIST_CONTACTS_ERROR, LIST_CONTACTS_SUCCESS,
  UPDATE_CONTACT, UPDATE_CONTACT_ERROR, UPDATE_CONTACT_SUCCESS
} from '../actionTypes';

const contacts = (
  state = {
    isListing: false,
    isUpdating: false,
    isGetting: false,
    isAdding: false,
    searchText: '',
    contacts: [],
    profileContact: null,
    listError: null,
    saveError: null,
    getError: null,
    addError: null
  },
  action) => {
  switch (action.type) {
    case LIST_CONTACTS:
      return Object.assign({}, state, { isListing: true, searchText: action.searchText, listError: null });
    case LIST_CONTACTS_SUCCESS:
      return Object.assign({}, state, { isListing: false, searchText: action.searchText, contacts: action.contacts, listError: null });
    case LIST_CONTACTS_ERROR:
      return Object.assign({}, state, { isListing: false, listError: action.error });
    case UPDATE_CONTACT:
      return Object.assign({}, state, { isUpdating: true, saveError: null });
    case UPDATE_CONTACT_SUCCESS:
      return Object.assign({}, state, { isUpdating: false, profileContact: action.contact, saveError: null });
    case UPDATE_CONTACT_ERROR:
      return Object.assign({}, state, { isUpdating: false, saveError: action.error });
    case GET_CONTACT:
      return Object.assign({}, state, { isGetting: true, getError: null });
    case GET_CONTACT_SUCCESS:
      return Object.assign({}, state, { isGetting: false, profileContact: action.contact, getError: null });
    case GET_CONTACT_ERROR:
      return Object.assign({}, state, { isGetting: false, getError: action.error });
    case ADD_CONTACT:
      return Object.assign({}, state, { isAdding: true, addError: null });
    case ADD_CONTACT_SUCCESS:
      return Object.assign({}, state, { isAdding: false, addError: null });
    case ADD_CONTACT_ERROR:
      return Object.assign({}, state, { isAdding: false, addError: action.error });
    default:
      return state;
  }
}

export default contacts;
