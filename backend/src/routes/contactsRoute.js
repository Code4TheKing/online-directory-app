const express = require('express');
const router = express.Router();
const repository = require('../mongodb/repository');
const authz = require('../utils/authz');
const auth0 = require('../utils/auth0');

// Add contact
router.post('/', (req, res, next) => {
  authz.enforceAuthorization(
    req.user,
    ['create:contacts'],
    req, res, next,
    (req, res, next) => repository.addContact(
      req.body,
      (err, contact) => {
        if (err) return next(err);
        if (!contact) {
          return next(new Error('Something went wrong. Could not add contact for the given input.'));
        }
        res.json(contact);
      }
    ));
});

// Get contact by ID
router.get('/:id', (req, res, next) => {
  authz.enforceAuthorization(
    req.user,
    ['read:contacts'],
    req, res, next,
    (req, res, next) => repository.getContactById(
      req.params.id,
      (err, contact) => {
        if (err) return next(err);
        if (!contact) {
          const notFoundError = new Error(`No contact found for ID ${req.params.id}`);
          notFoundError.statusCode = 404;
          return next(notFoundError);
        }
        res.json(contact);
      }
    ));
});

// Update contact by ID
router.patch('/:id', (req, res, next) => {
  delete req.body.idpSub;
  authz.enforceAuthorization(
    req.user,
    ['update:contacts'],
    req, res, next,
    (req, res, next) => repository.getContactById(
      req.params.id,
      (err, existingContact) => {
        if (err) return next(err);
        if (!existingContact) {
          const notFoundError = new Error(`No contact found for ID ${req.params.id}`);
          notFoundError.statusCode = 404;
          return next(notFoundError);
        }
        repository.updateContact(
          existingContact._id,
          req.body,
          (err, updatedContact) => {
            if (err) return next(err);
            if (!updatedContact) {
              return next(new Error('Something went wrong. Could not update contact for the given input.'));
            }
            res.json(updatedContact);
          }
        )
      }
    ));
});

// List contacts by keyword
router.get('/', (req, res, next) => {
  authz.enforceAuthorization(
    req.user,
    ['read:contacts'],
    req, res, next,
    (req, res, next) => repository.listContactsByKeyword(
      req.query.keyword,
      (err, contactsList) => {
        if (err) return next(err);
        res.json({ contacts: contactsList });
      }
    ));
});

// Invite contact to register
router.post('/:id/invite', (req, res, next) => {
  authz.enforceAuthorization(
    req.user,
    ['invite:contacts'],
    req, res, next,
    (req, res, next) => repository.getContactById(
      req.params.id,
      (err, contact) => {
        if (err) return next(err);
        if (!contact) {
          const notFoundError = new Error(`No contact found for ID ${req.params.id}`);
          notFoundError.statusCode = 404;
          return next(notFoundError);
        }
        auth0.getAccessToken()
          .then(accessToken =>
            Promise.all([auth0.createUser(accessToken, req.body.email, contact.name, req.params.id), auth0.getParticipantRoleId(accessToken)])
              .then(([createUserResponse, participantRoleId]) =>
                auth0.assignParticipantRoleToUser(accessToken, createUserResponse?.data?.user_id, participantRoleId))
              .then(() => auth0.triggerChangePassword(req.body.email))
              .then((changePasswordResponse) => res.json({ result: changePasswordResponse.data })))
          .catch(err => handleError(err, next));
      }
    ));
});

const handleError = (err, next) => {
  console.log(err);
  if (err?.response?.data) {
    return next(err.response.data);
  }
  return next(err);
}

module.exports = router;
