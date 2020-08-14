import {
  GET_CONTACT, GET_CONTACT_ERROR, GET_CONTACT_SUCCESS,
  LIST_CONTACTS, LIST_CONTACTS_ERROR, LIST_CONTACTS_SUCCESS,
  SAVE_CONTACT, SAVE_CONTACT_ERROR, SAVE_CONTACT_SUCCESS
} from '../actionTypes';

const contacts = (
  state = {
    isListing: false,
    isSaving: false,
    isGetting: false,
    searchText: '',
    contacts: [],
    profileContact: null,
    listError: null,
    saveError: null,
    getError: null
  },
  action) => {
  switch (action.type) {
    case LIST_CONTACTS:
      return Object.assign({}, state, { isListing: true, searchText: action.searchText, listError: null });
    case LIST_CONTACTS_SUCCESS:
      return Object.assign({}, state, { isListing: false, searchText: action.searchText, contacts: action.contacts, listError: null });
    case LIST_CONTACTS_ERROR:
      return Object.assign({}, state, { isListing: false, listError: action.error });
    case SAVE_CONTACT:
      return Object.assign({}, state, { isSaving: true, saveError: null });
    case SAVE_CONTACT_SUCCESS:
      return Object.assign({}, state, { isSaving: false, profileContact: action.contact, saveError: null });
    case SAVE_CONTACT_ERROR:
      return Object.assign({}, state, { isSaving: false, saveError: action.error });
    case GET_CONTACT:
      return Object.assign({}, state, { isGetting: true, getError: null });
    case GET_CONTACT_SUCCESS:
      return Object.assign({}, state, { isGetting: false, profileContact: action.contact, getError: null });
    case GET_CONTACT_ERROR:
      return Object.assign({}, state, { isGetting: false, getError: action.error });
    default:
      return state;
  }
}

export default contacts;
