const express = require('express');
const router = express.Router();
const repository = require('../mongodb/repository');
const auth = require('../utils/auth');

// Add contact
router.post('/', (req, res, next) => {
  auth.enforceAuthorization(
    req.user,
    ['create:contacts'],
    req, res, next,
    (req, res, next) => repository.addContact(
      req.body,
      (err, data) => {
        if (err) return next(err);
        if (!data) {
          return next(new Error('Something went wrong. Could not add contact for the given input.'));
        }
        res.json(data);
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
      (err, data) => {
        if (err) return next(err);
        if (!data) {
          const notFoundError = new Error(`No contact found for ID ${req.params.id}`);
          notFoundError.statusCode = 404;
          return next(notFoundError);
        }
        res.json(data);
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
          (err, data) => {
            if (err) return next(err);
            if (!data) {
              return next(new Error('Something went wrong. Could not update contact for the given input.'));
            }
            res.json(data);
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
      (err, data) => {
        if (err) return next(err);
        res.json({ contacts: data });
      }
    ));
});

module.exports = router;
