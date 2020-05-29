const express = require('express');
const path = require('path');
const InvoiceService = require('./invoice-service');
const { requireAuth } = require('../middleware/jwt-auth');

const invoiceRouter = express.Router();
const jsonParser = express.json();

invoiceRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    InvoiceService.getAllInvoices(req.app.get('db'), req.user.id)
      .then((invoice) => res.json(invoice))
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { client, date_created, total_sale } = req.body;
    const newInvoice = { client, date_created, total_sale };

    for (const [key, value] of Object.entries(newInvoice))
      if (value === null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });
    newInvoice.user_id = req.user.id;

    InvoiceService.insertInvoice(req.app.get('db'), newInvoice)
      .then((invoice) => {
        res.status(201).json(invoice);
      })
      .catch(next);
  });

invoiceRouter
  .route('/invoice/:id')
  .all(requireAuth)
  .all(checkExists)
  .get((req, res, next) => {
    InvoiceService.getByInvoiceId(req.app.get('db'), req.user.id, req.params.id)
      .then((invoice) => res.json(invoice))
      .catch(next);
  })
  .delete((req, res, next) => {
    InvoiceService.deleteInvoice(req.app.get('db'), req.params.id)
      .then(() => {
        res.status(204).json({ message: 'Successfully deleted' });
      })
      .catch(next);
  })
  .patch(requireAuth, jsonParser, (req, res, next) => {
    const { client, date, total_sale } = req.body;
    const updateInvoice = { client, date, total_sale };

    for (const [key, value] of Object.entries(updateInvoice))
      if (value === null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });

    updateInvoice.user_id = req.user.id;

    InvoiceService.updateInvoice(
      req.app.get('db'),
      req.params.id,
      updateInvoice
    )
      .then((invoice) => {
        res.status(201).json(invoice);
      })
      .catch((err) => next(err));
  });

async function checkExists(req, res, next) {
  try {
    const invoice = await InvoiceService.getByInvoiceId(
      req.app.get('db'),
      req.user.id,
      req.params.id
    );

    if (!invoice)
      return res.status(404).json({
        error: `Invoice doesn't exist`,
      });

    res.invoice = invoice;
    next();
  } catch (error) {
    next(error);
  }
}
module.exports = invoiceRouter;
