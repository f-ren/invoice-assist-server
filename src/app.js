require('dotenv').config();
const express = require('express');
const xss = require('xss');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const authRouter = require('./auth/auth-router');
const invoiceRouter = require('./invoice/invoice-router');
const itemsRouter = require('./items/items-router');
const productsRouter = require('./products/products-router');
const userRouter = require('./user/user-router');

const app = express();

const morganOption = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/', invoiceRouter);
app.use('/items', itemsRouter);
app.use('/products', productsRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    response = { message: error.message, error };
  }
  console.error(error);
  res.status(500).json(response);
});

module.exports = app;
