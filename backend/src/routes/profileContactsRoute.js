const express = require('express');
const router = express.Router();
const repository = require('../mongodb/repository');
const auth0 = require('../utils/auth0');
const authz = require('../utils/authz');

// Create profile contact
router.post('/', (req, res, next) => {
  delete req.body.idpSub;
  authz.enforceAuthorization(
    req.user,
    ['create:profile_contact'],
    req, res, next,
    (req, res, next) => {
      const idpSub = req.user.sub;
      repository.getContactByIdpSubject(
        idpSub,
        (err, existingProfileContact) => {
          if (err) return next(err);
          if (existingProfileContact) {
            const conflictError = new Error(`Profile contact already exists for IDP sub ${idpSub}`);
            conflictError.statusCode = 409;
            return next(conflictError);
          }
          auth0.getAccessToken()
            .then(accessToken => auth0.getUser(accessToken, idpSub))
            .then(user => repository.updateContact(
              user.user_metadata.contact_id,
              { idpSubject: idpSub },
              (err, profileContact) => {
                if (err) return next(err);
                if (!profileContact) {
                  return next(new Error(`Something went wrong. Could not create profile contact for ${idpSub}.`));
                }
                authz.isAdmin(
                  req.user,
                  (err, isAdmin) => {
                    if (err) { return next(err); }
                    res.json(Object.assign(profileContact, { admin: isAdmin }));
                  });
              },
              true))
            .catch(err => handleError(err, next));
        },
        true
      );
    });
});

// Get profile contact
router.get('/', (req, res, next) => {
  authz.enforceAuthorization(
    req.user,
    ['read:profile_contact'],
    req, res, next,
    (req, res, next) => repository.getContactByIdpSubject(
      req.user.sub,
      (err, profileContact) => {
        if (err) return next(err);
        if (!profileContact) {
          const notFoundError = new Error(`There is no profile contact for IDP sub ${req.user.sub}. Create one first.`);
          notFoundError.statusCode = 404;
          return next(notFoundError);
        }
        authz.isAdmin(
          req.user,
          (err, isAdmin) => {
            if (err) { return next(err); }
            res.json(Object.assign(profileContact, { admin: isAdmin }));
          });
      },
      true
    ));
});

// Update profile contact
router.patch('/', (req, res, next) => {
  delete req.body.idpSub;
  authz.enforceAuthorization(
    req.user,
    ['update:profile_contact'],
    req, res, next,
    (req, res, next) => repository.getContactByIdpSubject(
      req.user.sub,
      (err, existingProfileContact) => {
        if (err) return next(err);
        if (!existingProfileContact) {
          const notFoundError = new Error(`There is no profile contact for IDP sub ${req.user.sub}. Create one first.`);
          notFoundError.statusCode = 404;
          return next(notFoundError);
        }
        repository.updateContact(
          existingProfileContact._id,
          req.body,
          (err, profileContact) => {
            if (err) return next(err);
            if (!profileContact) {
              return next(new Error(`Something went wrong. Could not update profile contact for ${idpSub}.`));
            }
            res.json(profileContact);
          }
        );
      },
      true
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
