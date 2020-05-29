const express = require('express');
const path = require('path');
const ItemsService = require('./items-service');
const { requireAuth } = require('../middleware/jwt-auth');

const itemsRouter = express.Router();
const jsonParser = express.json();

itemsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    ItemsService.getAllItems(req.app.get('db'), req.user.id)
      .then((items) => res.json(items))
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { invoice_id, product_id, qty } = req.body;
    const newItem = { invoice_id, product_id, qty };

    for (const [key, value] of Object.entries(newItem))
      if (value === null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });
    newItem.user_id = req.user.id;

    ItemsService.insertItem(req.app.get('db'), newItem)
      .then((item) => {
        res.status(201).json(item);
      })
      .catch(next);
  });
module.exports = itemsRouter;
