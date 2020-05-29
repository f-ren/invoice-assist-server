const express = require('express');
const path = require('path');
const ProductsService = require('./products-service');
const { requireAuth } = require('../middleware/jwt-auth');

const productsRouter = express.Router();
const jsonParser = express.json();

productsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    ProductsService.getAllProducts(req.app.get('db'), req.user.id)
      .then((products) => res.json(products))
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { descr, sale_price } = req.body;
    const newProduct = { descr, sale_price };

    for (const [key, value] of Object.entries(newProduct))
      if (value === null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });
    newProduct.user_id = req.user.id;

    ProductsService.insertProduct(req.app.get('db'), newProduct)
      .then((product) => {
        res.status(201).json(product);
      })
      .catch(next);
  });
productsRouter
  .route('/:id')
  .all(requireAuth)
  .patch(requireAuth, jsonParser, (req, res, next) => {
    const { descr, sale_price } = req.body;
    const updateProduct = { descr, sale_price };

    for (const [key, value] of Object.entries(updateProduct))
      if (value === null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });
    updateProduct.user_id = req.user.id;

    ProductsService.updateProduct(
      req.app.get('db'),
      req.params.id,
      updateProduct
    )
      .then((product) => {
        res.status(201).json(product);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    ProductsService.deleteProduct(req.app.get('db'), req.params.id)
      .then(() => {
        res.status(204).json({ message: 'Successfully deleted' });
      })
      .catch(next);
  });
module.exports = productsRouter;
