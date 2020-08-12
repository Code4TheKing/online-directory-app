import { GET_CONTACT, GET_CONTACT_SUCCESS, LIST_CONTACTS, LIST_CONTACTS_SUCCESS, SAVE_CONTACT, SAVE_CONTACT_SUCCESS } from '../actionTypes';

const contacts = (
  state = {
    isFetchingList: false,
    isSaving: false,
    isGetting: false,
    contacts: [],
    profileContact: undefined
  },
  action) => {
  switch (action.type) {
    case LIST_CONTACTS:
      return Object.assign({}, state, { isFetchingList: true });
    case LIST_CONTACTS_SUCCESS:
      return Object.assign({}, state, { isFetchingList: false, contacts: action.contacts });
    case SAVE_CONTACT:
      return Object.assign({}, state, { isSaving: true });
    case GET_CONTACT:
      return Object.assign({}, state, { isSaving: true });
    case SAVE_CONTACT_SUCCESS:
      const newState = Object.assign({}, state);
      const contactExistsInContactList = newState.contacts.some(contact => contact.id === action.contact.id);
      if (contactExistsInContactList) {
        newState.contacts = newState.contacts.filter(contact => contact.id !== action.contact.id);
        newState.contacts.push(action.contact);
      }
      return Object.assign({}, newState);
    case GET_CONTACT_SUCCESS:
      return Object.assign({}, state, { profileContact: action.contact });
    default:
      return state;
  }
}

export default contacts;
