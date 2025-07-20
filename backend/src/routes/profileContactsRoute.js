/** @format */

const express = require('express');
const router = express.Router();
const repository = require('../mongodb/repository');
const authz = require('../utils/authz');
const auth0 = require('../utils/auth0');
const errors = require('../utils/errors');

// Ensure JSON body parsing middleware is used
//router.use(express.json());

// Create profile contact
router.post('/', (req, res, next) => {
  authz.enforceAuthorization(req.auth, ['create:profile_contact'], req, res, next, (req, res, next) => {
    const idpSub = req.auth.sub;
    repository
      .getContactByIdpSubject(idpSub)
      .catch((err) => {
        if (err.statusCode !== 404) {
          throw err;
        }
      })
      .then((existingProfileContact) => {
        if (existingProfileContact) {
          throw errors.generateError(`Profile contact already exists for IDP sub ${idpSub}`, 409);
        }
      })
      .then(() =>
        auth0.getAccessToken().then((accessToken) =>
          auth0
            .getUser(accessToken, idpSub, 'name,given_name,family_name,user_metadata')
            .then((user) =>
              Promise.all([
                user.user_metadata?.contact_id
                  ? repository
                      .getContactById(user.user_metadata.contact_id)
                      .then((contact) =>
                        repository.updateContact(
                          contact._id,
                          { idpSubjects: contact.idpSubjects ? [...contact.idpSubjects, idpSub] : [idpSub] },
                          true
                        )
                      )
                      .catch(() =>
                        repository.addContact({
                          firstName: user.given_name?? user.name,
                          lastName: user.family_name?? "Fix Me",
                          idpSubjects: [idpSub]
                        })
                      )
                  : repository.addContact({
                      firstName: user.given_name?? user.name,
                      lastName: user.family_name?? "Fix me",
                      idpSubjects: [idpSub]
                    }),
                authz.isAdmin(accessToken, req.auth)
              ])
            )
            .then(([profileContact, isAdmin]) => res.json(Object.assign(profileContact, { admin: isAdmin })))
        )
      )
      .catch((err) => handleError(err, next));
  });
});

// Get profile contact
router.get('/', (req, res, next) => {
  authz.enforceAuthorization(req.auth, ['read:profile_contact'], req, res, next, (req, res, next) =>
    repository
      .getContactByIdpSubject(req.auth.sub, true)
      .then((profileContact) =>
        auth0
          .getAccessToken()
          .then((accessToken) => authz.isAdmin(accessToken, req.auth))
          .then((isAdmin) => {
            res.json(Object.assign(profileContact, { admin: isAdmin }));
          })
      )
      .catch((err) => handleError(err, next))
  );
});

// Update profile contact
router.patch('/', (req, res, next) => {
  delete req.body.idpSub;
  authz.enforceAuthorization(req.auth, ['update:profile_contact'], req, res, next, (req, res, next) =>
    repository
      .getContactByIdpSubject(req.auth.sub)
      .then((existingProfileContact) => repository.updateContact(existingProfileContact._id, req.body))
      .then((updatedProfileContact) => res.json(updatedProfileContact))
      .catch((err) => handleError(err, next))
  );
});

const handleError = (err, next) => {
  console.log(err);
  return err?.response?.data ? next(err.response.data) : next(err);
};

module.exports = router;
