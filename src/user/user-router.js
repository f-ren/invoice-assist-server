const express = require('express');
const path = require('path');
const UserService = require('./user-service');
const { requireAuth } = require('../middleware/jwt-auth');

const userRouter = express.Router();
const jsonParser = express.json();

userRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    UserService.getUserById(req.app.get('db'), req.user.id)
      .then((user) => res.json(user))
      .catch(next);
  })
  .patch(requireAuth, jsonParser, (req, res, next) => {
    const { first_name, last_name, company_name, email } = req.body;
    const updateUser = { first_name, last_name, company_name, email };

    for (const [key, value] of Object.entries(updateUser))
      if (value === null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });
    updateUser.user_id = req.user.id;
    console.log('hello', req.user.id);
    UserService.updateUser(req.app.get('db'), req.user.id, updateUser)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch(next);
  });
module.exports = userRouter;
