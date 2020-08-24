const express = require('express');
const router = express.Router();
const repository = require('../mongodb/repository');
const auth = require('../utils/auth');

// Create profile contact
router.post('/', (req, res, next) => {
  auth.enforceAuthorization(
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
          const accessToken = req.get('Authorization').substring('Bearer '.length);
          auth.getUserInfo(accessToken, (err, userInfo) => {
            if (err) return next(err);
            if (!userInfo) {
              return next(new Error(`Something went wrong. Could not get user info for ${idpSub}.`));
            }
            repository.addContact(
              Object.assign({ name: userInfo.name }, { idpSubject: idpSub }),
              (err, profileContact) => {
                if (err) return next(err);
                if (!profileContact) {
                  return next(new Error(`Something went wrong. Could not create profile contact for ${idpSub}.`));
                }
                auth.isAdmin(
                  req.user,
                  (err, isAdmin) => {
                    if (err) { return next(err); }
                    res.json(Object.assign(profileContact, { admin: isAdmin }));
                  });
              },
              true
            );
          });
        },
        true);
    });
});

// Get profile contact
router.get('/', (req, res, next) => {
  auth.enforceAuthorization(
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
        auth.isAdmin(
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
  auth.enforceAuthorization(
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

module.exports = router;
