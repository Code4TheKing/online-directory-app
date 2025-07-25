/** @format */

import { toast } from 'react-toastify';
import { SEARCH_ALL_KEYWORD } from '../pages/Directory';
import {
  addContact,
  addContactError,
  addContactSuccess,
  createProfileContact,
  createProfileContactError,
  createProfileContactSuccess,
  getContact,
  getContactError,
  getContactSuccess,
  getFieldDefinitions,
  getFieldDefinitionsError,
  getFieldDefinitionsSuccess,
  getProfileContact,
  getProfileContactError,
  getProfileContactSuccess,
  inviteContact,
  inviteContactError,
  inviteContactSuccess,
  listAllContacts,
  listAllContactsError,
  listAllContactsSuccess,
  listUsersForContact,
  listUsersForContactError,
  listUsersForContactSuccess,
  searchContacts,
  searchContactsError,
  searchContactsSuccess,
  updateContact,
  updateContactError,
  updateContactSuccess,
  updateProfileContact,
  updateProfileContactError,
  updateProfileContactSuccess
} from './actionCreators';

// Async dispatches for Contacts

export const getFieldDefinitionsAsync = (token) => {
  return (dispatch) => {
    dispatch(getFieldDefinitions());
    return fetch(`${getApiUrl()}/${process.env.REACT_APP_API_BASE_PATH}/contacts/field-definitions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) =>
        response
          .json()
          .then((responseJson) => ({ responseJson, response }))
          .then(({ responseJson, response }) => {
            if (!response.ok) {
              dispatch(getFieldDefinitionsError(responseJson));
              return Promise.reject(responseJson);
            } else {
              dispatch(getFieldDefinitionsSuccess(responseJson));
              return responseJson;
            }
          })
      )
      .catch((err) => console.error(err));
  };
};

export const addContactAsync = (fieldDefinitions, contact, pictureFile, token) => {
  return (dispatch) => {
    dispatch(addContact());
    if (pictureFile) {
      return uploadProfilePicture(dispatch, pictureFile)
        .then((responseJson) =>
          addContactTextFields(
            dispatch,
            fieldDefinitions,
            Object.assign({}, contact, {
              picture: {
                link: responseJson.data.link,
                hash: responseJson.data.deletehash
              }
            }),
            token
          )
        )
        .catch((err) => console.error(err));
    }
    return addContactTextFields(dispatch, fieldDefinitions, maybeClearPicture(contact, pictureFile), token).catch(
      (err) => console.error(err)
    );
  };
};

const addContactTextFields = (dispatch, fieldDefinitions, contact, token) => {
  return fetch(`${getApiUrl()}/${process.env.REACT_APP_API_BASE_PATH}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contact)
  }).then((response) =>
    response
      .json()
      .then((responseJson) => ({ responseJson, response }))
      .then(({ responseJson, response }) => {
        if (!response.ok) {
          dispatch(addContactError(responseJson));
          toast.error(
            `Error adding "${fieldDefinitions.mainFields.reduce(
              (acc, curr) => `${contact[acc.propName]} ${contact[curr.propName]}`
            )}" - ${responseJson.message}`
          );
          return Promise.reject(responseJson);
        } else {
          dispatch(addContactSuccess(responseJson));
          toast.success(
            `Added "${fieldDefinitions.mainFields.reduce(
              (acc, curr) => `${contact[acc.propName]} ${contact[curr.propName]}`
            )}"`
          );
          return responseJson;
        }
      })
  );
};

export const getContactAsync = (contactId, token) => {
  return (dispatch) => {
    dispatch(getContact());
    return fetch(`${getApiUrl()}/${process.env.REACT_APP_API_BASE_PATH}/contacts/${contactId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) =>
        response
          .json()
          .then((responseJson) => ({ responseJson, response }))
          .then(({ responseJson, response }) => {
            if (!response.ok) {
              dispatch(getContactError(responseJson));
              toast.error(`Error getting contact for ID "${contactId}" - ${responseJson.message}`);
              return Promise.reject(responseJson);
            } else {
              dispatch(getContactSuccess(responseJson));
              return responseJson;
            }
          })
      )
      .catch((err) => console.error(err));
  };
};

export const searchContactsAsync = (keyword, token) => {
  return (dispatch) => {
    dispatch(searchContacts(keyword));
    return listContacts(keyword, token)
      .then(({ responseJson, response }) => {
        if (!response.ok) {
          dispatch(searchContactsError(responseJson));
          toast.error(`Error searching contacts for keyword "${keyword}" - ${responseJson.message}`);
          return Promise.reject(responseJson);
        } else {
          dispatch(searchContactsSuccess(keyword, responseJson));
          return responseJson;
        }
      })
      .catch((err) => console.error(err));
  };
};

export const listAllContactsAsync = (token) => {
  return (dispatch) => {
    dispatch(listAllContacts());
    return listContacts(SEARCH_ALL_KEYWORD, token)
      .then(({ responseJson, response }) => {
        if (!response.ok) {
          dispatch(listAllContactsError(responseJson));
          toast.error(`Error listing all contacts - ${responseJson.message}`);
          return Promise.reject(responseJson);
        } else {
          dispatch(listAllContactsSuccess(responseJson));
          return responseJson;
        }
      })
      .catch((err) => console.error(err));
  };
};

const listContacts = (keyword, token) => {
  return fetch(
    `${getApiUrl()}/${process.env.REACT_APP_API_BASE_PATH}/contacts` +
      `?keyword=${encodeURIComponent(keyword)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  ).then((response) => response.json().then((responseJson) => ({ responseJson, response })));
};

export const listUsersForContactAsync = (contactId, token) => {
  return (dispatch) => {
    dispatch(listUsersForContact());
    return fetch(
      `${getApiUrl()}/${process.env.REACT_APP_API_BASE_PATH}/contacts/${contactId}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((response) =>
        response
          .json()
          .then((responseJson) => ({ responseJson, response }))
          .then(({ responseJson, response }) => {
            if (!response.ok) {
              dispatch(listUsersForContactError(responseJson));
              toast.error(`Error getting linked users for contact ID "${contactId}" - ${responseJson.message}`);
              return Promise.reject(responseJson);
            } else {
              dispatch(listUsersForContactSuccess(responseJson));
              return responseJson;
            }
          })
      )
      .catch((err) => console.error(err));
  };
};

export const updateContactAsync = (fieldDefinitions, contact, pictureFile, token) => {
  return (dispatch) => {
    dispatch(updateContact());
    if (pictureFile) {
      return uploadProfilePicture(dispatch, pictureFile)
        .then((responseJson) =>
          updateContactTextFields(
            dispatch,
            fieldDefinitions,
            Object.assign({}, contact, {
              picture: {
                link: responseJson.data.link,
                hash: responseJson.data.deletehash
              }
            }),
            token
          )
        )
        .catch((err) => console.error(err));
    }
    return updateContactTextFields(dispatch, fieldDefinitions, maybeClearPicture(contact, pictureFile), token).catch(
      (err) => console.error(err)
    );
  };
};

const updateContactTextFields = (dispatch, fieldDefinitions, contact, token) => {
  return fetch(
    `${getApiUrl()}/${process.env.REACT_APP_API_BASE_PATH}/contacts/${
      contact[fieldDefinitions.idField.propName]
    }`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contact)
    }
  ).then((response) =>
    response
      .json()
      .then((responseJson) => ({ responseJson, response }))
      .then(({ responseJson, response }) => {
        if (!response.ok) {
          dispatch(updateContactError(responseJson));
          toast.error(`Error editing contact - ${responseJson.message}`);
          return Promise.reject(responseJson);
        } else {
          dispatch(updateContactSuccess(responseJson));
          toast.success('Contact edited!');
          return responseJson;
        }
      })
  );
};

export const inviteContactAsync = (fieldDefinitions, contact, email, token) => {
  return (dispatch) => {
    dispatch(inviteContact());
    return fetch(
      `${getApiUrl()}/${process.env.REACT_APP_API_BASE_PATH}/contacts/${
        contact[fieldDefinitions.idField.propName]
      }/invite`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      }
    )
      .then((response) =>
        response
          .json()
          .then((responseJson) => ({ responseJson, response }))
          .then(({ responseJson, response }) => {
            if (!response.ok) {
              dispatch(inviteContactError(responseJson));
              toast.error(
                `Error inviting "${fieldDefinitions.mainFields.reduce(
                  (acc, curr) => `${contact[acc.propName]} ${contact[curr.propName]}`
                )}" - ${responseJson.message}`
              );
              return Promise.reject(responseJson);
            } else {
              dispatch(inviteContactSuccess(responseJson));
              toast.success(
                `Invitation sent for "${fieldDefinitions.mainFields.reduce(
                  (acc, curr) => `${contact[acc.propName]} ${contact[curr.propName]}`
                )}"`
              );
              return responseJson;
            }
          })
      )
      .catch((err) => console.error(err));
  };
};

// Async dispatches for profile contacts

export const createProfileContactAsync = (token) => {
  return (dispatch) => {
    dispatch(createProfileContact());
    return fetch(`${getApiUrl()}/${process.env.REACT_APP_API_BASE_PATH}/profile-contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) =>
        response
          .json()
          .then((responseJson) => ({ responseJson, response }))
          .then(({ responseJson, response }) => {
            if (!response.ok) {
              dispatch(createProfileContactError(responseJson));
              return Promise.reject(responseJson);
            } else {
              dispatch(createProfileContactSuccess(responseJson));
              return responseJson;
            }
          })
      )
      .catch((err) => console.error(err));
  };
};

export const getProfileContactAsync = (token) => {
  return (dispatch) => {
    dispatch(getProfileContact());
    return fetch(`${getApiUrl()}/${process.env.REACT_APP_API_BASE_PATH}/profile-contacts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) =>
        response
          .json()
          .then((responseJson) => ({ responseJson, response }))
          .then(({ responseJson, response }) => {
            if (!response.ok) {
              dispatch(getProfileContactError(responseJson));
              return Promise.reject(responseJson);
            } else {
              dispatch(getProfileContactSuccess(responseJson));
              return responseJson;
            }
          })
      )
      .catch((err) => console.error(err));
  };
};

export const updateProfileContactAsync = (fieldDefinitions, profileContact, pictureFile, token) => {
  return (dispatch) => {
    dispatch(updateProfileContact());
    if (pictureFile) {
      return uploadProfilePicture(dispatch, pictureFile)
        .then((responseJson) =>
          updateProfileContactTextFields(
            dispatch,
            Object.assign({}, profileContact, {
              picture: {
                link: responseJson.data.link,
                hash: responseJson.data.deletehash
              }
            }),
            token
          )
        )
        .catch((err) => console.error(err));
    }
    return updateProfileContactTextFields(dispatch, maybeClearPicture(profileContact, pictureFile), token).catch(
      (err) => console.error(err)
    );
  };
};

const uploadProfilePicture = (dispatch, pictureFile) => {
  const formdata = new FormData();
  formdata.append('image', pictureFile);
  return fetch(process.env.REACT_APP_IMGUR_UPLOAD_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Client-ID ${process.env.REACT_APP_IMGUR_CLIENT_ID}`
    },
    body: formdata
  }).then((response) =>
    response
      .json()
      .then((responseJson) => ({ responseJson, response }))
      .then(({ responseJson, response }) => {
        if (!response.ok) {
          dispatch(updateProfileContactError(responseJson));
          toast.error(`Error uploading picture - ${responseJson.message}`);
          return Promise.reject(responseJson);
        }
        return responseJson;
      })
  );
};

const updateProfileContactTextFields = (dispatch, localProfileContact, token) => {
  return fetch(`${getApiUrl()}/${process.env.REACT_APP_API_BASE_PATH}/profile-contacts`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(localProfileContact)
  }).then((response) =>
    response
      .json()
      .then((responseJson) => ({ responseJson, response }))
      .then(({ responseJson, response }) => {
        if (!response.ok) {
          dispatch(updateProfileContactError(responseJson));
          toast.error(`Error saving profile - ${responseJson.message}`);
          return Promise.reject(responseJson);
        } else {
          dispatch(updateProfileContactSuccess(responseJson));
          toast.success('Profile saved!');
          return responseJson;
        }
      })
  );
};

const maybeClearPicture = (contact, pictureFile) => {
  return Object.assign(
    {},
    contact,
    pictureFile === null
      ? {
          picture: null
        }
      : {}
  );
};

const getApiUrl = () => {
  if (process.env.REACT_APP_CONTEXT === 'deploy-preview') {
    let deployPreviewUrl = process.env.REACT_APP_DEPLOY_PREVIEW_API_URL;
    if (deployPreviewUrl) {
      deployPreviewUrl = deployPreviewUrl.replace(
      /\.netlify\.app$/,
      '-backend.netlify.app'
      );
      return deployPreviewUrl;
    }
  }
  return process.env.REACT_APP_API_URL;
};