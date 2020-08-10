import { RECEIVE_CONTACTS, REQUEST_CONTACTS } from '../actionTypes';

const listContacts = (
  state = {
    isFetching: false,
    contacts: []
  },
  action) => {
  switch (action.type) {
    case REQUEST_CONTACTS:
      return Object.assign({}, state, { isFetching: true });
    case RECEIVE_CONTACTS:
      return Object.assign({}, state, { isFetching: false, contacts: action.contacts });
    default:
      return state;
  }
}

export default listContacts;
