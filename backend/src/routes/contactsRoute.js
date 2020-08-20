const express = require('express');
const router = express.Router();
const repository = require('../mongodb/repository');

// Add contact
router.post('/', (req, res, next) => {
  repository.addContact(
    req.body,
    (err, data) => {
      if (err) return next(err);
      res.json(data);
    }
  );
});

// Get contact by ID
router.get('/:id', (req, res, next) => {
  repository.getContactById(
    req.params.id,
    (err, data) => {
      if (err) next(err);
      res.json(data);
    }
  );
})

// Update contact by ID
router.patch('/:id', (req, res, next) => {
  repository.updateContact(
    req.params.id,
    req.body,
    (err, data) => {
      if (err) return next(err);
      res.json(data);
    }
  );
});

// List contacts by keyword
router.get('/', (req, res, next) => {
  repository.listContactsByKeyword(
    req.query.keyword,
    (err, data) => {
      if (err) return next(err);
      res.json({ contacts: data });
    }
  );
})

module.exports = router;