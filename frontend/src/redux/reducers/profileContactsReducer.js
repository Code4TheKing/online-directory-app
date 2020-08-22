import {
  ADD_PROFILE_CONTACT, ADD_PROFILE_CONTACT_ERROR, ADD_PROFILE_CONTACT_SUCCESS,
  GET_PROFILE_CONTACT, GET_PROFILE_CONTACT_ERROR, GET_PROFILE_CONTACT_SUCCESS,
  UPDATE_PROFILE_CONTACT, UPDATE_PROFILE_CONTACT_ERROR, UPDATE_PROFILE_CONTACT_SUCCESS
} from '../actionTypes';

const profileContacts = (
  state = {
    isAddingProfileContact: false,
    isGettingProfileContact: false,
    isUpdatingProfileContact: false,
    profileContact: null,
    addProfileContactError: null,
    getProfileContactError: null,
    updateProfileContactError: null
  },
  action) => {
  switch (action.type) {
    case ADD_PROFILE_CONTACT:
      return Object.assign({}, state, { isAddingProfileContact: true, addProfileContactError: null });
    case ADD_PROFILE_CONTACT_SUCCESS:
      return Object.assign({}, state, { isAddingProfileContact: false, addProfileContactError: null });
    case ADD_PROFILE_CONTACT_ERROR:
      return Object.assign({}, state, { isAddingProfileContact: false, addProfileContactError: action.error });
    case GET_PROFILE_CONTACT:
      return Object.assign({}, state, { isGettingProfileContact: true, getProfileContactError: null });
    case GET_PROFILE_CONTACT_SUCCESS:
      return Object.assign({}, state, { isGettingProfileContact: false, profileContact: action.profileContact, getProfileContactError: null });
    case GET_PROFILE_CONTACT_ERROR:
      return Object.assign({}, state, { isGettingProfileContact: false, getProfileContactError: action.error });
    case UPDATE_PROFILE_CONTACT:
      return Object.assign({}, state, { isUpdatingProfileContact: true, updateProfileContactError: null });
    case UPDATE_PROFILE_CONTACT_SUCCESS:
      return Object.assign({}, state, { isUpdatingProfileContact: false, profileContact: action.profileContact, updateProfileContactError: null });
    case UPDATE_PROFILE_CONTACT_ERROR:
      return Object.assign({}, state, { isUpdatingProfileContact: false, updateProfileContactError: action.error });
    default:
      return state;
  }
}

export default profileContacts;
