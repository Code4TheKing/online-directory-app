import {
  ADD_CONTACT, ADD_CONTACT_ERROR, ADD_CONTACT_SUCCESS,
  ADD_PROFILE_CONTACT, ADD_PROFILE_CONTACT_ERROR, ADD_PROFILE_CONTACT_SUCCESS,
  GET_PROFILE_CONTACT, GET_PROFILE_CONTACT_ERROR, GET_PROFILE_CONTACT_SUCCESS,
  LIST_CONTACTS, LIST_CONTACTS_ERROR, LIST_CONTACTS_SUCCESS,
  UPDATE_CONTACT, UPDATE_CONTACT_ERROR, UPDATE_CONTACT_SUCCESS,
  UPDATE_PROFILE_CONTACT, UPDATE_PROFILE_CONTACT_ERROR, UPDATE_PROFILE_CONTACT_SUCCESS
} from './actionTypes';

// Action creators for contacts

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

const updateContact = () => {
  return {
    type: UPDATE_CONTACT
  }
}

const updateContactSuccess = (contact) => {
  return {
    type: UPDATE_CONTACT_SUCCESS,
    contact: contact
  }
}

const updateContactError = (err) => {
  console.warn(err);
  return {
    type: UPDATE_CONTACT_ERROR,
    error: err
  }
}

// Action creators for profile contacts

const addProfileContact = () => {
  return {
    type: ADD_PROFILE_CONTACT
  }
}

const addProfileContactSuccess = (profileContact) => {
  return {
    type: ADD_PROFILE_CONTACT_SUCCESS,
    profileContact: profileContact
  }
}

const addProfileContactError = (err) => {
  console.warn(err);
  return {
    type: ADD_PROFILE_CONTACT_ERROR,
    error: err
  }
}

const getProfileContact = () => {
  return {
    type: GET_PROFILE_CONTACT
  }
}

const getProfileContactSuccess = (profileContact) => {
  return {
    type: GET_PROFILE_CONTACT_SUCCESS,
    profileContact: profileContact
  }
}

const getProfileContactError = (err) => {
  console.warn(err);
  return {
    type: GET_PROFILE_CONTACT_ERROR,
    error: err
  }
}

const updateProfileContact = () => {
  return {
    type: UPDATE_PROFILE_CONTACT
  }
}

const updateProfileContactSuccess = (profileContact) => {
  return {
    type: UPDATE_PROFILE_CONTACT_SUCCESS,
    profileContact: profileContact
  }
}

const updateProfileContactError = (err) => {
  console.warn(err);
  return {
    type: UPDATE_PROFILE_CONTACT_ERROR,
    error: err
  }
}

// Async dispatches for Contacts

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

export const updateContactAsync = (contact, token) => {
  const localContact = Object.assign({}, contact);
  delete localContact._id;
  return (dispatch) => {
    dispatch(updateContact());
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
            dispatch(updateContactError(contact.message));
            return Promise.reject(contact);
          } else {
            dispatch(updateContactSuccess(contact));
          }
        }))
      .catch((err) => console.error(err));
  };
}

// Async dispatches for profile contacts

export const addProfileContactAsync = (profileContact, token) => {
  return (dispatch) => {
    dispatch(addProfileContact());
    return fetch(`http://localhost:4000/_api/v1/profile-contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileContact)
    })
      .then(response => response.json()
        .then((profileContact) => ({ profileContact, response }))
        .then(({ profileContact, response }) => new Promise(resolve => { setTimeout(() => resolve({ profileContact, response }), 1500) }))
        .then(({ profileContact, response }) => {
          if (!response.ok) {
            dispatch(addProfileContactError(profileContact.message));
            return Promise.reject(profileContact);
          } else {
            dispatch(addProfileContactSuccess(profileContact));
          }
        }))
      .catch((err) => console.error(err));
  };
}

export const getProfileContactAsync = (token) => {
  return (dispatch) => {
    dispatch(getProfileContact());
    return fetch(
      `http://localhost:4000/_api/v1/profile-contacts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then(response => response.json()
        .then((profileContact) => ({ profileContact, response }))
        .then(({ profileContact, response }) => new Promise(resolve => { setTimeout(() => resolve({ profileContact, response }), 1500) }))
        .then(({ profileContact, response }) => {
          if (!response.ok) {
            dispatch(getProfileContactError(profileContact.message));
            return Promise.reject(profileContact);
          } else {
            dispatch(getProfileContactSuccess(profileContact));
          }
        }))
      .catch((err) => console.error(err));
  }
}

export const updateProfileContactAsync = (profileContact, token) => {
  const localProfileContact = Object.assign({}, profileContact);
  delete localProfileContact._id;
  return (dispatch) => {
    dispatch(updateProfileContact());
    return fetch(
      `http://localhost:4000/_api/v1/profile-contacts`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localProfileContact)
      })
      .then(response => response.json()
        .then((profileContact) => ({ profileContact, response }))
        .then(({ profileContact, response }) => new Promise(resolve => { setTimeout(() => resolve({ profileContact, response }), 1500) }))
        .then(({ profileContact, response }) => {
          if (!response.ok) {
            dispatch(updateProfileContactError(profileContact.message));
            return Promise.reject(profileContact);
          } else {
            dispatch(updateProfileContactSuccess(profileContact));
          }
        }))
      .catch((err) => console.error(err));
  };
}
