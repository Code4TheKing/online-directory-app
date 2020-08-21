const express = require('express');
const router = express.Router();
const repository = require('../mongodb/repository');

// Add contact
router.post('/', (req, res, next) => {
  enforceAuthorization(
    req.user,
    ['create:contacts', 'create:profile_contact'],
    req, res, next,
    (req, res, next) => repository.addContact(
      req.body,
      (err, data) => {
        if (err) return next(err);
        res.json(data);
      }
    ));
});

// Get contact by ID
router.get('/:id', (req, res, next) => {
  enforceAuthorization(
    req.user,
    ['read:contacts', 'read:profile_contact'],
    req, res, next,
    (req, res, next) => repository.getContactById(
      req.params.id,
      (err, data) => {
        if (err) next(err);
        res.json(data);
      }
    ));
});

// Update contact by ID
router.patch('/:id', (req, res, next) => {
  enforceAuthorization(
    req.user,
    ['update:contacts', 'update:profile_contact'],
    req, res, next,
    (req, res, next) => repository.updateContact(
      req.params.id,
      req.body,
      (err, data) => {
        if (err) return next(err);
        res.json(data);
      }
    ));
});

// List contacts by keyword
router.get('/', (req, res, next) => {
  enforceAuthorization(
    req.user,
    ['read:contacts'],
    req, res, next,
    (req, res, next) => repository.listContactsByKeyword(
      req.query.keyword,
      (err, data) => {
        if (err) return next(err);
        res.json({ contacts: data });
      }
    ));
});

const enforceAuthorization = (user, allowedPermissions, req, res, next, cb) => {
  if (!isAuthorized(user, allowedPermissions)) {
    const error = new Error(`User must have one of the permissions in [${allowedPermissions.map(perm => `'${perm}'`).join(', ')}]`);
    error.status = 401;
    next(error);
  } else {
    cb(req, res, next);
  }
}

const isAuthorized = (user, allowedPermissions) => {
  return allowedPermissions.some(permission => user.permissions.indexOf(permission) !== -1);
}

module.exports = router;
