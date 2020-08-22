const express = require('express');
const router = express.Router();
const repository = require('../mongodb/repository');
const enforceAuthorization = require('../utils/auth');

// Add profile contact
router.post('/', (req, res, next) => {
  enforceAuthorization(
    req.user,
    ['create:profile_contact'],
    req, res, next,
    (req, res, next) => {
      const idpSub = req.user.sub;
      repository.getContactByIdpSubject(
        idpSub,
        (err, existingProfileContact) => {
          if (err) return next(err);
          if (!existingProfileContact) {
            repository.addContact(
              Object.assign(req.body, { idpSubject: idpSub }),
              (err, data) => {
                if (err) return next(err);
                if (!data) {
                  return next(new Error(`Something went wrong. Could not add profile contact for ${idpSub}.`));
                }
                res.json(data);
              }
            );
            return;
          }
          const conflictError = new Error(`Profile contact already exists for IDP sub ${idpSub}`);
          conflictError.status = 409;
          return next(conflictError);
        });
    });
});

// Get profile contact
router.get('/', (req, res, next) => {
  enforceAuthorization(
    req.user,
    ['read:profile_contact'],
    req, res, next,
    (req, res, next) => repository.getContactByIdpSubject(
      req.user.sub,
      (err, data) => {
        if (err) return next(err);
        if (!data) {
          const notFoundError = new Error(`There is no profile contact for IDP sub ${req.user.sub}. Create one first.`);
          notFoundError.status = 404;
          return next(notFoundError);
        }
        res.json(data);
      }
    ));
});

// Update profile contact
router.patch('/', (req, res, next) => {
  enforceAuthorization(
    req.user,
    ['update:profile_contact'],
    req, res, next,
    (req, res, next) => repository.getContactByIdpSubject(
      req.user.sub,
      (err, existingProfileContact) => {
        if (err) next(err);
        if (!existingProfileContact) {
          const notFoundError = new Error(`There is no profile contact for IDP sub ${req.user.sub}. Create one first.`);
          notFoundError.status = 404;
          return next(notFoundError);
        }
        repository.updateContact(
          existingProfileContact._id,
          req.body,
          (err, data) => {
            if (err) return next(err);
            if (!data) {
              return next(new Error(`Something went wrong. Could not update profile contact for ${idpSub}.`));
            }
            res.json(data);
          }
        );
      }
    ));
});

module.exports = router;
