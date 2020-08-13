import { GET_CONTACT, GET_CONTACT_SUCCESS, LIST_CONTACTS, LIST_CONTACTS_SUCCESS, SAVE_CONTACT, SAVE_CONTACT_SUCCESS } from '../actionTypes';

const contacts = (
  state = {
    isListing: false,
    isSaving: false,
    isGetting: false,
    contacts: [],
    profileContact: null
  },
  action) => {
  switch (action.type) {
    case LIST_CONTACTS:
      return Object.assign({}, state, { isListing: true });
    case LIST_CONTACTS_SUCCESS:
      return Object.assign({}, state, { isListing: false, contacts: action.contacts });
    case SAVE_CONTACT:
      return Object.assign({}, state, { isSaving: true });
    case SAVE_CONTACT_SUCCESS:
      return Object.assign({}, state, { isSaving: false });
    case GET_CONTACT:
      return Object.assign({}, state, { isGetting: true });
    case GET_CONTACT_SUCCESS:
      return Object.assign({}, state, { isGetting: false, profileContact: action.contact });
    default:
      return state;
  }
}

export default contacts;
