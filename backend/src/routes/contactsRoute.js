const express = require('express');
const router = express.Router();
const repository = require('../mongodb/repository');
const auth = require('../utils/auth');
const invite = require('../utils/invite');

// Add contact
router.post('/', (req, res, next) => {
  auth.enforceAuthorization(
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
  auth.enforceAuthorization(
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
  auth.enforceAuthorization(
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
  auth.enforceAuthorization(
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
  auth.enforceAuthorization(
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
        auth.getAccessToken()
          .then(accessToken => Promise.all([invite.createUser(accessToken, req.body.email, contact.name), invite.getParticipantRoleId(accessToken)])
            .then(([createUserResponse, participantRoleId]) =>
              invite.assignParticipantRoleToUser(accessToken, createUserResponse?.data?.user_id, participantRoleId))
            .then(() => invite.triggerChangePassword(req.body.email))
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
