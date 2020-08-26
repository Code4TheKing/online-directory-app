const express = require('express');
const router = express.Router();
const repository = require('../mongodb/repository');
const auth0 = require('../utils/auth0');
const authz = require('../utils/authz');

// Create profile contact
router.post('/', (req, res, next) => {
  authz.enforceAuthorization(
    req.user,
    ['create:profile_contact'],
    req, res, next,
    (req, res, next) => {
      const idpSub = req.user.sub;
      repository.getContactByIdpSubject(idpSub)
        .catch(err => {
          if (err.statusCode !== 404) {
            throw err;
          }
        })
        .then(existingProfileContact => {
          if (existingProfileContact) {
            const conflictError = new Error(`Profile contact already exists for IDP sub ${idpSub}`);
            conflictError.statusCode = 409;
            throw conflictError;
          }
        })
        .then(() => auth0.getAccessToken()
          .then(accessToken => auth0.getUser(accessToken, idpSub)
            .then(user => Promise.all([
              user.user_metadata?.contact_id ?
                repository.updateContact(user.user_metadata.contact_id, { idpSubject: idpSub }, true) :
                repository.addContact({ name: user.name, idpSubject: idpSub }),
              authz.isAdmin(accessToken, req.user)
            ]))
            .then(([profileContact, isAdmin]) => {
              res.json(Object.assign(profileContact, { admin: isAdmin }));
            })))
        .catch(err => handleError(err, next));
    }
  );
});

// Get profile contact
router.get('/', (req, res, next) => {
  authz.enforceAuthorization(
    req.user,
    ['read:profile_contact'],
    req, res, next,
    (req, res, next) => repository.getContactByIdpSubject(req.user.sub, true)
      .then(profileContact => auth0.getAccessToken()
        .then(accessToken => authz.isAdmin(accessToken, req.user))
        .then(isAdmin => {
          res.json(Object.assign(profileContact, { admin: isAdmin }));
        }))
      .catch(err => handleError(err, next))
  );
});

// Update profile contact
router.patch('/', (req, res, next) => {
  delete req.body.idpSub;
  authz.enforceAuthorization(
    req.user,
    ['update:profile_contact'],
    req, res, next,
    (req, res, next) => repository.getContactByIdpSubject(req.user.sub,)
      .then(existingProfileContact => repository.updateContact(existingProfileContact._id, req.body))
      .then(updatedProfileContact => {
        res.json(updatedProfileContact);
      })
      .catch(err => handleError(err, next))
  );
});

const handleError = (err, next) => {
  console.log(err);
  if (err?.response?.data) {
    return next(err.response.data);
  }
  return next(err);
}

module.exports = router;
