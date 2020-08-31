import {
  ADD_CONTACT, ADD_CONTACT_ERROR, ADD_CONTACT_SUCCESS,
  CREATE_PROFILE_CONTACT, CREATE_PROFILE_CONTACT_ERROR, CREATE_PROFILE_CONTACT_SUCCESS,
  GET_FIELD_DEFINITIONS, GET_FIELD_DEFINITIONS_ERROR, GET_FIELD_DEFINITIONS_SUCCESS,
  GET_PROFILE_CONTACT, GET_PROFILE_CONTACT_ERROR, GET_PROFILE_CONTACT_SUCCESS,
  INVITE_CONTACT, INVITE_CONTACT_ERROR, INVITE_CONTACT_SUCCESS,
  LIST_CONTACTS, LIST_CONTACTS_ERROR, LIST_CONTACTS_SUCCESS,
  UPDATE_CONTACT, UPDATE_CONTACT_ERROR, UPDATE_CONTACT_SUCCESS,
  UPDATE_PROFILE_CONTACT, UPDATE_PROFILE_CONTACT_ERROR, UPDATE_PROFILE_CONTACT_SUCCESS
} from './actionTypes';

// Action creators for contacts

const getFieldDefinitions = () => {
  return {
    type: GET_FIELD_DEFINITIONS
  }
}

const getFieldDefinitionsSuccess = (fieldDefinitions) => {
  return {
    type: GET_FIELD_DEFINITIONS_SUCCESS,
    fieldDefinitions: fieldDefinitions
  }
}

const getFieldDefinitionsError = (err) => {
  return {
    type: GET_FIELD_DEFINITIONS_ERROR,
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
  return {
    type: UPDATE_CONTACT_ERROR,
    error: err
  }
}

const inviteContact = () => {
  return {
    type: INVITE_CONTACT
  }
}

const inviteContactSuccess = () => {
  return {
    type: INVITE_CONTACT_SUCCESS
  }
}

const inviteContactError = (err) => {
  return {
    type: INVITE_CONTACT_ERROR,
    error: err
  }
}

// Action creators for profile contacts

const createProfileContact = () => {
  return {
    type: CREATE_PROFILE_CONTACT
  }
}

const createProfileContactSuccess = (profileContact) => {
  return {
    type: CREATE_PROFILE_CONTACT_SUCCESS,
    profileContact: profileContact
  }
}

const createProfileContactError = (err) => {
  return {
    type: CREATE_PROFILE_CONTACT_ERROR,
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
  return {
    type: UPDATE_PROFILE_CONTACT_ERROR,
    error: err
  }
}

// Async dispatches for Contacts

export const getFieldDefinitionsAsync = (token) => {
  return (dispatch) => {
    dispatch(getFieldDefinitions());
    return fetch(
      `${process.env.REACT_APP_API_URL}/_api/v1/contacts/field-definitions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then(response => response.json()
        .then((responseJson) => ({ responseJson, response }))
        .then(({ responseJson, response }) => new Promise(resolve => { setTimeout(() => resolve({ responseJson, response }), 500) }))
        .then(({ responseJson, response }) => {
          if (!response.ok) {
            dispatch(getFieldDefinitionsError(responseJson));
            return Promise.reject(responseJson);
          } else {
            dispatch(getFieldDefinitionsSuccess(responseJson));
          }
        }))
      .catch((err) => console.error(err));
  }
}

export const addContactAsync = (contact, token) => {
  return (dispatch) => {
    dispatch(addContact());
    return fetch(`${process.env.REACT_APP_API_URL}/_api/v1/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact)
    })
      .then(response => response.json()
        .then((responseJson) => ({ responseJson, response }))
        .then(({ responseJson, response }) => new Promise(resolve => { setTimeout(() => resolve({ responseJson, response }), 500) }))
        .then(({ responseJson, response }) => {
          if (!response.ok) {
            dispatch(addContactError(responseJson));
            return Promise.reject(responseJson);
          } else {
            dispatch(addContactSuccess(responseJson));
          }
        }))
      .catch((err) => console.error(err));
  };
}

export const listContactsByKeywordAsync = (keyword, token) => {
  return (dispatch) => {
    dispatch(listContacts(keyword));
    return fetch(
      `${process.env.REACT_APP_API_URL}/_api/v1/contacts?keyword=${keyword}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then(response => response.json()
        .then((responseJson) => ({ responseJson, response }))
        .then(({ responseJson, response }) => new Promise(resolve => { setTimeout(() => resolve({ responseJson, response }), 500) }))
        .then(({ responseJson, response }) => {
          if (!response.ok) {
            dispatch(listContactsError(responseJson));
            return Promise.reject(responseJson);
          } else {
            dispatch(listContactsSuccess(keyword, responseJson));
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
      `${process.env.REACT_APP_API_URL}/_api/v1/contacts/${contact._id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localContact)
      })
      .then(response => response.json()
        .then((responseJson) => ({ responseJson, response }))
        .then(({ responseJson, response }) => new Promise(resolve => { setTimeout(() => resolve({ responseJson, response }), 500) }))
        .then(({ responseJson, response }) => {
          if (!response.ok) {
            dispatch(updateContactError(responseJson));
            return Promise.reject(responseJson);
          } else {
            dispatch(updateContactSuccess(responseJson));
          }
        }))
      .catch((err) => console.error(err));
  };
}

export const inviteContactAsync = (contactId, email, token) => {
  return (dispatch) => {
    dispatch(inviteContact());
    return fetch(`${process.env.REACT_APP_API_URL}/_api/v1/contacts/${contactId}/invite`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email })
    })
      .then(response => response.json()
        .then((responseJson) => ({ responseJson, response }))
        .then(({ responseJson, response }) => new Promise(resolve => { setTimeout(() => resolve({ responseJson, response }), 500) }))
        .then(({ responseJson, response }) => {
          if (!response.ok) {
            dispatch(inviteContactError(responseJson));
            return Promise.reject(responseJson);
          } else {
            dispatch(inviteContactSuccess(responseJson));
          }
        }))
      .catch((err) => console.error(err));
  };
}

// Async dispatches for profile contacts

export const createProfileContactAsync = (token) => {
  return (dispatch) => {
    dispatch(createProfileContact());
    return fetch(`${process.env.REACT_APP_API_URL}/_api/v1/profile-contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json()
        .then((responseJson) => ({ responseJson, response }))
        .then(({ responseJson, response }) => new Promise(resolve => { setTimeout(() => resolve({ responseJson, response }), 500) }))
        .then(({ responseJson, response }) => {
          if (!response.ok) {
            dispatch(createProfileContactError(responseJson));
            return Promise.reject(responseJson);
          } else {
            dispatch(createProfileContactSuccess(responseJson));
          }
        }))
      .catch((err) => console.error(err));
  };
}

export const getProfileContactAsync = (token) => {
  return (dispatch) => {
    dispatch(getProfileContact());
    return fetch(
      `${process.env.REACT_APP_API_URL}/_api/v1/profile-contacts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then(response => response.json()
        .then((responseJson) => ({ responseJson, response }))
        .then(({ responseJson, response }) => new Promise(resolve => { setTimeout(() => resolve({ responseJson, response }), 500) }))
        .then(({ responseJson, response }) => {
          if (!response.ok) {
            dispatch(getProfileContactError(responseJson));
            return Promise.reject(responseJson);
          } else {
            dispatch(getProfileContactSuccess(responseJson));
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
      `${process.env.REACT_APP_API_URL}/_api/v1/profile-contacts`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localProfileContact)
      })
      .then(response => response.json()
        .then((responseJson) => ({ responseJson, response }))
        .then(({ responseJson, response }) => new Promise(resolve => { setTimeout(() => resolve({ responseJson, response }), 500) }))
        .then(({ responseJson, response }) => {
          if (!response.ok) {
            dispatch(updateProfileContactError(responseJson));
            return Promise.reject(responseJson);
          } else {
            dispatch(updateProfileContactSuccess(responseJson));
          }
        }))
      .catch((err) => console.error(err));
  };
}
