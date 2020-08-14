import {
  GET_CONTACT, GET_CONTACT_ERROR, GET_CONTACT_SUCCESS,
  LIST_CONTACTS, LIST_CONTACTS_ERROR, LIST_CONTACTS_SUCCESS,
  SAVE_CONTACT, SAVE_CONTACT_ERROR, SAVE_CONTACT_SUCCESS
} from './actionTypes';

const listContacts = (searchText) => {
  return {
    type: LIST_CONTACTS,
    searchText: searchText
  }
}

const listContactsSuccess = (searchText, json) => {
  return {
    type: LIST_CONTACTS_SUCCESS,
    searchText: searchText,
    contacts: json.contacts
  }
}

const listContactsError = (err) => {
  console.warn(err);
  return {
    type: LIST_CONTACTS_ERROR,
    error: err
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

const saveContactError = (err) => {
  console.warn(err);
  return {
    type: SAVE_CONTACT_ERROR,
    error: err
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

const getContactError = (err) => {
  console.warn(err);
  return {
    type: GET_CONTACT_ERROR,
    error: err
  }
}

const address = 'Started at the bottom now we here.';
const FAKE_CONTACTS_DATA = [
  {
    _id: 1,
    name: "1",
    address: address,
    phoneNumber: "(999) 999-9999"
  },
  {
    _id: 2,
    name: "2",
    address: address,
    phoneNumber: "(999) 999-9999"
  },
  {
    _id: 3,
    name: "3",
    address: [address, address].join(' '),
    phoneNumber: "(999) 999-9999"
  },
  {
    _id: 4,
    name: "4",
    address: address,
    phoneNumber: "(999) 999-9999"
  },
  {
    _id: 5,
    name: "5",
    address: [address, address, address, address].join(' '),
    phoneNumber: "(999) 999-9999"
  },
  {
    _id: 6,
    name: "6",
    address: address,
    phoneNumber: "(999) 999-9999"
  },
  {
    _id: 7,
    name: "7",
    address: [address, address, address].join(' '),
    phoneNumber: "(999) 999-9999"
  },
  {
    _id: 8,
    name: "8",
    address: address,
    phoneNumber: "(999) 999-9999"
  },
  {
    _id: 9,
    name: "9",
    address: [address, address].join(' '),
    phoneNumber: "(999) 999-9999"
  },
  {
    _id: 10,
    name: "10",
    address: address,
    phoneNumber: "(999) 999-9999"
  },
  {
    _id: 11,
    name: "11",
    address: [address, address, address, address].join(' '),
    phoneNumber: "(999) 999-9999"
  },
  {
    _id: 99,
    name: "99",
    address: "Default address",
    phoneNumber: "(123) 456-7890"
  }
];

export const listContactsBySearchAsync = (searchText) => {
  return (dispatch) => {
    dispatch(listContacts(searchText));
    setTimeout(() => {
      let json = {
        contacts: searchText ? FAKE_CONTACTS_DATA : []
      };
      dispatch(listContactsSuccess(searchText, json));
    }, 1000);
  };
}

export const saveContactAsync = (contact) => {
  const localContact = Object.assign({}, contact);
  delete localContact._id;
  return (dispatch) => {
    dispatch(saveContact());
    fetch(`http://localhost:4000/_api/v1/contacts/${contact._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(localContact)
    })
      .then(res => res.json())
      .then((contact) => dispatch(saveContactSuccess(contact)))
      .catch((err) => dispatch(saveContactError(err)));
  };
}

export const getContactByIdAsync = (id) => {
  return (dispatch) => {
    dispatch(getContact());
    fetch(`http://localhost:4000/_api/v1/contacts/${id}`)
      .then(res => res.json())
      .then((contact) => dispatch(getContactSuccess(contact)))
      .catch((err) => dispatch(getContactError(err)));
  }
}
