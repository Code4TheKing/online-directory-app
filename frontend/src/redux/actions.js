import {
  ADD_CONTACT, ADD_CONTACT_ERROR, ADD_CONTACT_SUCCESS,
  GET_CONTACT, GET_CONTACT_ERROR, GET_CONTACT_SUCCESS,
  LIST_CONTACTS, LIST_CONTACTS_ERROR, LIST_CONTACTS_SUCCESS,
  UPDATE_CONTACT, UPDATE_CONTACT_ERROR, UPDATE_CONTACT_SUCCESS
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
    type: UPDATE_CONTACT
  }
}

const saveContactSuccess = (contact) => {
  return {
    type: UPDATE_CONTACT_SUCCESS,
    contact: contact
  }
}

const saveContactError = (err) => {
  console.warn(err);
  return {
    type: UPDATE_CONTACT_ERROR,
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

const addContact = () => {
  return {
    type: ADD_CONTACT
  }
}

const addContactSuccess = (contact) => {
  return {
    type: ADD_CONTACT_SUCCESS,
    contact: contact
  }
}

const addContactError = (err) => {
  console.warn(err);
  return {
    type: ADD_CONTACT_ERROR,
    error: err
  }
}

export const listContactsByKeywordAsync = (keyword) => {
  return (dispatch) => {
    dispatch(listContacts(keyword));
    return fetch(`http://localhost:4000/_api/v1/contacts?keyword=${keyword}`)
      .then(res => res.json())
      .then((contactsJson) => new Promise(resolve => { setTimeout(() => resolve(contactsJson), 1500) }))
      .then((contactsJson) => dispatch(listContactsSuccess(keyword, contactsJson)))
      .catch((err) => dispatch(listContactsError(err)));
  };
}

export const saveContactAsync = (contact) => {
  const localContact = Object.assign({}, contact);
  delete localContact._id;
  return (dispatch) => {
    dispatch(saveContact());
    return fetch(`http://localhost:4000/_api/v1/contacts/${contact._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(localContact)
    })
      .then(res => res.json())
      .then((contact) => new Promise(resolve => { setTimeout(() => resolve(contact), 1500) }))
      .then((contact) => dispatch(saveContactSuccess(contact)))
      .catch((err) => dispatch(saveContactError(err)));
  };
}

export const getContactByIdAsync = (id) => {
  return (dispatch) => {
    dispatch(getContact());
    return fetch(`http://localhost:4000/_api/v1/contacts/${id}`)
      .then(res => res.json())
      .then((contact) => new Promise(resolve => { setTimeout(() => resolve(contact), 1500) }))
      .then((contact) => dispatch(getContactSuccess(contact)))
      .catch((err) => dispatch(getContactError(err)));
  }
}

export const addContactAsync = (contact) => {
  return (dispatch) => {
    dispatch(addContact());
    return fetch(`http://localhost:4000/_api/v1/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact)
    })
      .then(res => res.json())
      .then((contact) => new Promise(resolve => { setTimeout(() => resolve(contact), 1500) }))
      .then((contact) => dispatch(addContactSuccess(contact)))
      .catch((err) => dispatch(addContactError(err)));
  };
}
