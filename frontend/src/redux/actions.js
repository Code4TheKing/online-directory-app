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

export const listContactsByKeywordAsync = (keyword, token) => {
  return (dispatch) => {
    dispatch(listContacts(keyword));
    return fetch(
      `http://localhost:4000/_api/v1/contacts?keyword=${keyword}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then(response => response.json()
        .then((contacts) => ({ contacts, response }))
        .then(({ contacts, response }) => new Promise(resolve => { setTimeout(() => resolve({ contacts, response }), 1500) }))
        .then(({ contacts, response }) => {
          if (!response.ok) {
            dispatch(listContactsError(contacts.message));
            return Promise.reject(contacts);
          } else {
            dispatch(listContactsSuccess(keyword, contacts));
          }
        }))
      .catch((err) => console.error(err));
  };
}

export const saveContactAsync = (contact, token) => {
  const localContact = Object.assign({}, contact);
  delete localContact._id;
  return (dispatch) => {
    dispatch(saveContact());
    return fetch(
      `http://localhost:4000/_api/v1/contacts/${contact._id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localContact)
      })
      .then(response => response.json()
        .then((contact) => ({ contact, response }))
        .then(({ contact, response }) => new Promise(resolve => { setTimeout(() => resolve({ contact, response }), 1500) }))
        .then(({ contact, response }) => {
          if (!response.ok) {
            dispatch(saveContactError(contact.message));
            return Promise.reject(contact);
          } else {
            dispatch(saveContactSuccess(contact));
          }
        }))
      .catch((err) => console.error(err));
  };
}

export const getContactByIdAsync = (id, token) => {
  return (dispatch) => {
    dispatch(getContact());
    return fetch(
      `http://localhost:4000/_api/v1/contacts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then(response => response.json()
        .then((contact) => ({ contact, response }))
        .then(({ contact, response }) => new Promise(resolve => { setTimeout(() => resolve({ contact, response }), 1500) }))
        .then(({ contact, response }) => {
          if (!response.ok) {
            dispatch(getContactError(contact.message));
            return Promise.reject(contact);
          } else {
            dispatch(getContactSuccess(contact));
          }
        }))
      .catch((err) => console.error(err));
  }
}

export const addContactAsync = (contact, token) => {
  return (dispatch) => {
    dispatch(addContact());
    return fetch(`http://localhost:4000/_api/v1/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact)
    })
      .then(response => response.json()
        .then((contact) => ({ contact, response }))
        .then(({ contact, response }) => new Promise(resolve => { setTimeout(() => resolve({ contact, response }), 1500) }))
        .then(({ contact, response }) => {
          if (!response.ok) {
            dispatch(addContactError(contact.message));
            return Promise.reject(contact);
          } else {
            dispatch(addContactSuccess(contact));
          }
        }))
      .catch((err) => console.error(err));
  };
}
