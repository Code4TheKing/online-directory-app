/** @format */

import {
  CREATE_PROFILE_CONTACT,
  CREATE_PROFILE_CONTACT_ERROR,
  CREATE_PROFILE_CONTACT_SUCCESS,
  GET_PROFILE_CONTACT,
  GET_PROFILE_CONTACT_ERROR,
  GET_PROFILE_CONTACT_SUCCESS,
  UPDATE_PROFILE_CONTACT,
  UPDATE_PROFILE_CONTACT_ERROR,
  UPDATE_PROFILE_CONTACT_SUCCESS
} from '../actionTypes';

const profileContacts = (
  state = {
    isCreatingProfileContact: false,
    isGettingProfileContact: false,
    isUpdatingProfileContact: false,
    profileContact: null,
    isAdmin: null,
    createProfileContactError: null,
    getProfileContactError: null,
    updateProfileContactError: null
  },
  action
) => {
  switch (action.type) {
    case CREATE_PROFILE_CONTACT:
      return Object.assign({}, state, { isCreatingProfileContact: true, createProfileContactError: null });
    case CREATE_PROFILE_CONTACT_SUCCESS:
      return Object.assign({}, state, {
        isCreatingProfileContact: false,
        profileContact: action.profileContact,
        isAdmin: action.profileContact.admin,
        createProfileContactError: null
      });
    case CREATE_PROFILE_CONTACT_ERROR:
      return Object.assign({}, state, { isCreatingProfileContact: false, createProfileContactError: action.error });
    case GET_PROFILE_CONTACT:
      return Object.assign({}, state, { isGettingProfileContact: true, getProfileContactError: null });
    case GET_PROFILE_CONTACT_SUCCESS:
      return Object.assign({}, state, {
        isGettingProfileContact: false,
        profileContact: action.profileContact,
        isAdmin: action.profileContact.admin,
        getProfileContactError: null
      });
    case GET_PROFILE_CONTACT_ERROR:
      return Object.assign({}, state, { isGettingProfileContact: false, getProfileContactError: action.error });
    case UPDATE_PROFILE_CONTACT:
      return Object.assign({}, state, { isUpdatingProfileContact: true, updateProfileContactError: null });
    case UPDATE_PROFILE_CONTACT_SUCCESS:
      return Object.assign({}, state, {
        isUpdatingProfileContact: false,
        profileContact: action.profileContact,
        updateProfileContactError: null
      });
    case UPDATE_PROFILE_CONTACT_ERROR:
      return Object.assign({}, state, { isUpdatingProfileContact: false, updateProfileContactError: action.error });
    default:
      return state;
  }
};

export default profileContacts;
