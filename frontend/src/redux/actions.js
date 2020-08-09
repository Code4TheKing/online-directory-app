import { RECEIVE_CONTACTS, REQUEST_CONTACTS } from './actionTypes';

const requestContacts = () => {
  return {
    type: REQUEST_CONTACTS
  }
}

const receiveContacts = (json) => {
  return {
    type: RECEIVE_CONTACTS,
    contacts: json.contacts
  }
}

const FAKE_CONTACTS_DATA = (searchText) => ([
  {
    id: 1,
    name: 1,
    address: searchText,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 2,
    name: 2,
    address: searchText,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 3,
    name: 3,
    address: searchText + searchText,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 4,
    name: 4,
    address: searchText,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 5,
    name: 5,
    address: searchText + searchText + searchText + searchText,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 6,
    name: 6,
    address: searchText,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 7,
    name: 7,
    address: searchText + searchText + searchText,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 8,
    name: 8,
    address: searchText,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 9,
    name: 9,
    address: searchText + searchText,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 10,
    name: 10,
    address: searchText,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 11,
    name: 11,
    address: searchText + searchText + searchText + searchText,
    phoneNumber: "(999) 999-9999"
  },
]);

export const fetchContactsBySearch = (searchText) => {
  return (dispatch) => {
    dispatch(requestContacts());
    setTimeout(() => {
      let json = {
        contacts: FAKE_CONTACTS_DATA(searchText)
      };
      dispatch(receiveContacts(json));
    }, 2500);
  };
}
