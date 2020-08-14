import store from '../redux/store';
import {
  GET_CONTACT, GET_CONTACT_ERROR, GET_CONTACT_SUCCESS,
  LIST_CONTACTS, LIST_CONTACTS_ERROR, LIST_CONTACTS_SUCCESS,
  SAVE_CONTACT, SAVE_CONTACT_ERROR, SAVE_CONTACT_SUCCESS
} from './actionTypes';

const listContacts = () => {
  return {
    type: LIST_CONTACTS
  }
}

const listContactsSuccess = (json) => {
  return {
    type: LIST_CONTACTS_SUCCESS,
    contacts: json.contacts
  }
}

const listContactsError = () => {
  return {
    type: LIST_CONTACTS_ERROR
  }
}

const saveContact = () => {
  return {
    type: SAVE_CONTACT
  }
}

const saveContactSuccess = (contact) => {
  return {
    type: SAVE_CONTACT_SUCCESS,
    contact: contact
  }
}

const saveContactError = () => {
  return {
    type: SAVE_CONTACT_ERROR
  }
}

const getContact = () => {
  return {
    type: GET_CONTACT
  }
}

const getContactSuccess = (contact) => {
  return {
    type: GET_CONTACT_SUCCESS,
    contact: contact
  }
}

const getContactError = () => {
  return {
    type: GET_CONTACT_ERROR
  }
}

const address = 'Started at the bottom now we here.';
const FAKE_CONTACTS_DATA = [
  {
    id: 1,
    name: "1",
    address: address,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 2,
    name: "2",
    address: address,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 3,
    name: "3",
    address: [address, address].join(' '),
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 4,
    name: "4",
    address: address,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 5,
    name: "5",
    address: [address, address, address, address].join(' '),
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 6,
    name: "6",
    address: address,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 7,
    name: "7",
    address: [address, address, address].join(' '),
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 8,
    name: "8",
    address: address,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 9,
    name: "9",
    address: [address, address].join(' '),
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 10,
    name: "10",
    address: address,
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 11,
    name: "11",
    address: [address, address, address, address].join(' '),
    phoneNumber: "(999) 999-9999"
  },
  {
    id: 99,
    name: "99",
    address: "Default address",
    phoneNumber: "(123) 456-7890"
  }
];

export const listContactsBySearchAsync = (searchText) => {
  return (dispatch) => {
    dispatch(listContacts());
    setTimeout(() => {
      let json = {
        contacts: searchText ? FAKE_CONTACTS_DATA : []
      };
      dispatch(listContactsSuccess(json));
    }, 500);
  };
}

export const saveContactAsync = (contact) => {
  return (dispatch) => {
    dispatch(saveContact());
    setTimeout(() => {
      dispatch(saveContactSuccess(contact));
    }, 1000);
  };
}

export const getContactByIdAsync = (id) => {
  const contacts = store.getState().contacts ? store.getState().contacts : FAKE_CONTACTS_DATA[-1];
  return (dispatch) => {
    dispatch(getContact());
    setTimeout(() => {
      dispatch(getContactSuccess(contacts.find(contact => contact.id === id)));
    }, 500);
  }
}
