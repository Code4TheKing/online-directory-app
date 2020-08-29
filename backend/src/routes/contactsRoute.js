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
    (req, res, next) => repository.addContact(req.body)
      .then(savedContact => {
        res.json(savedContact);
      })
      .catch(err => handleError(err, next))
  );
});

// Get contact by ID
router.get('/:id', (req, res, next) => {
  authz.enforceAuthorization(
    req.user,
    ['read:contacts'],
    req, res, next,
    (req, res, next) => repository.getContactById(req.params.id)
      .then(contact => {
        res.json(contact);
      })
      .catch(err => handleError(err, next))
  );
});

// Update contact by ID
router.patch('/:id', (req, res, next) => {
  delete req.body.idpSub;
  authz.enforceAuthorization(
    req.user,
    ['update:contacts'],
    req, res, next,
    (req, res, next) => repository.getContactById(req.params.id)
      .then(existingContact => repository.updateContact(existingContact._id, req.body))
      .then(updatedContact => {
        res.json(updatedContact);
      })
      .catch(err => handleError(err, next))
  );
});

// List contacts by keyword
router.get('/', (req, res, next) => {
  authz.enforceAuthorization(
    req.user,
    ['read:contacts'],
    req, res, next,
    (req, res, next) => repository.listContactsByKeyword(req.query.keyword)
      .then(contactsList => {
        res.json({ contacts: contactsList });
      })
      .catch(err => handleError(err, next))
  );
});

// Invite contact to register
router.post('/:id/invite', (req, res, next) => {
  authz.enforceAuthorization(
    req.user,
    ['invite:contacts'],
    req, res, next,
    (req, res, next) => repository.getContactById(req.params.id)
      .then(existingContact =>
        auth0.getAccessToken()
          .then(accessToken =>
            auth0.createUser(accessToken, req.body.email, existingContact.name, req.params.id)
              .catch(createUserErr => {
                if (createUserErr.response.status === 409) {
                  return auth0.getUserByEmail(accessToken, req.body.email)
                }
                throw createUserErr;
              })
              .then(user => auth0.getParticipantRoleId(accessToken)
                .then(participantRoleId => auth0.assignParticipantRoleToUser(accessToken, user.user_id, participantRoleId))
                .then(() => auth0.triggerChangePassword(req.body.email))
                .then((changePasswordResponse) => res.json({ result: changePasswordResponse.data })))))
      .catch(err => handleError(err, next)));
});

const handleError = (err, next) => {
  console.log(err);
  return err?.response?.data ? next(err.response.data) : next(err);
}

module.exports = router;
