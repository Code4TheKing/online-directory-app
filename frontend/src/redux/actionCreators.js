/** @format */

import {
  ADD_CONTACT,
  ADD_CONTACT_ERROR,
  ADD_CONTACT_SUCCESS,
  CREATE_PROFILE_CONTACT,
  CREATE_PROFILE_CONTACT_ERROR,
  CREATE_PROFILE_CONTACT_SUCCESS,
  GET_CONTACT,
  GET_CONTACT_ERROR,
  GET_CONTACT_SUCCESS,
  GET_FIELD_DEFINITIONS,
  GET_FIELD_DEFINITIONS_ERROR,
  GET_FIELD_DEFINITIONS_SUCCESS,
  GET_PROFILE_CONTACT,
  GET_PROFILE_CONTACT_ERROR,
  GET_PROFILE_CONTACT_SUCCESS,
  INVITE_CONTACT,
  INVITE_CONTACT_ERROR,
  INVITE_CONTACT_SUCCESS,
  LIST_ALL_CONTACTS,
  LIST_ALL_CONTACTS_ERROR,
  LIST_ALL_CONTACTS_SUCCESS,
  RESET_CONTACT,
  RESET_SEARCH_CONTACTS,
  SEARCH_CONTACTS,
  SEARCH_CONTACTS_ERROR,
  SEARCH_CONTACTS_SUCCESS,
  UPDATE_CONTACT,
  UPDATE_CONTACT_ERROR,
  UPDATE_CONTACT_SUCCESS,
  UPDATE_PROFILE_CONTACT,
  UPDATE_PROFILE_CONTACT_ERROR,
  UPDATE_PROFILE_CONTACT_SUCCESS
} from './actionTypes';

// Action creators for contacts

export const getFieldDefinitions = () => {
  return {
    type: GET_FIELD_DEFINITIONS
  };
};

export const getFieldDefinitionsSuccess = (fieldDefinitions) => {
  return {
    type: GET_FIELD_DEFINITIONS_SUCCESS,
    fieldDefinitions: fieldDefinitions
  };
};

export const getFieldDefinitionsError = (err) => {
  return {
    type: GET_FIELD_DEFINITIONS_ERROR,
    error: err
  };
};

export const addContact = () => {
  return {
    type: ADD_CONTACT
  };
};

export const addContactSuccess = (contact) => {
  return {
    type: ADD_CONTACT_SUCCESS,
    contact: contact
  };
};

export const addContactError = (err) => {
  return {
    type: ADD_CONTACT_ERROR,
    error: err
  };
};

export const getContact = () => {
  return {
    type: GET_CONTACT
  };
};

export const getContactSuccess = (contact) => {
  return {
    type: GET_CONTACT_SUCCESS,
    contact: contact
  };
};

export const getContactError = (err) => {
  return {
    type: GET_CONTACT_ERROR,
    error: err
  };
};

export const resetContact = () => {
  return {
    type: RESET_CONTACT
  };
};

export const searchContacts = (searchText) => {
  return {
    type: SEARCH_CONTACTS,
    searchText: searchText
  };
};

export const searchContactsSuccess = (searchText, json) => {
  return {
    type: SEARCH_CONTACTS_SUCCESS,
    searchText: searchText,
    contacts: json.contacts
  };
};

export const searchContactsError = (err) => {
  return {
    type: SEARCH_CONTACTS_ERROR,
    error: err
  };
};

export const resetSearchContacts = () => {
  return {
    type: RESET_SEARCH_CONTACTS
  };
};

export const listAllContacts = () => {
  return {
    type: LIST_ALL_CONTACTS
  };
};

export const listAllContactsSuccess = (json) => {
  return {
    type: LIST_ALL_CONTACTS_SUCCESS,
    contacts: json.contacts
  };
};

export const listAllContactsError = (err) => {
  return {
    type: LIST_ALL_CONTACTS_ERROR,
    error: err
  };
};

export const updateContact = () => {
  return {
    type: UPDATE_CONTACT
  };
};

export const updateContactSuccess = (contact) => {
  return {
    type: UPDATE_CONTACT_SUCCESS,
    contact: contact
  };
};

export const updateContactError = (err) => {
  return {
    type: UPDATE_CONTACT_ERROR,
    error: err
  };
};

export const inviteContact = () => {
  return {
    type: INVITE_CONTACT
  };
};

export const inviteContactSuccess = () => {
  return {
    type: INVITE_CONTACT_SUCCESS
  };
};

export const inviteContactError = (err) => {
  return {
    type: INVITE_CONTACT_ERROR,
    error: err
  };
};

// Action creators for profile contacts

export const createProfileContact = () => {
  return {
    type: CREATE_PROFILE_CONTACT
  };
};

export const createProfileContactSuccess = (profileContact) => {
  return {
    type: CREATE_PROFILE_CONTACT_SUCCESS,
    profileContact: profileContact
  };
};

export const createProfileContactError = (err) => {
  return {
    type: CREATE_PROFILE_CONTACT_ERROR,
    error: err
  };
};

export const getProfileContact = () => {
  return {
    type: GET_PROFILE_CONTACT
  };
};

export const getProfileContactSuccess = (profileContact) => {
  return {
    type: GET_PROFILE_CONTACT_SUCCESS,
    profileContact: profileContact
  };
};

export const getProfileContactError = (err) => {
  return {
    type: GET_PROFILE_CONTACT_ERROR,
    error: err
  };
};

export const updateProfileContact = () => {
  return {
    type: UPDATE_PROFILE_CONTACT
  };
};

export const updateProfileContactSuccess = (profileContact) => {
  return {
    type: UPDATE_PROFILE_CONTACT_SUCCESS,
    profileContact: profileContact
  };
};

export const updateProfileContactError = (err) => {
  return {
    type: UPDATE_PROFILE_CONTACT_ERROR,
    error: err
  };
};
